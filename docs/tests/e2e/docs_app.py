from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5557"
OUTPUT = Path(__file__).resolve().parents[1] / "test-results"


def expect_text(page, selector: str, expected: str) -> None:
    actual = page.locator(selector).first.inner_text()
    assert expected in actual, f"Expected {expected!r} in {actual!r}"


def assert_no_page_overflow(page) -> None:
    state = page.evaluate(
        """() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        })"""
    )
    assert state["scrollWidth"] == state["clientWidth"], state


OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    runtime_errors: list[str] = []
    page.on("pageerror", lambda error: runtime_errors.append(str(error)))
    page.on(
        "console",
        lambda message: runtime_errors.append(message.text)
        if message.type == "error"
        else None,
    )

    page.goto(f"{BASE_URL}/components/dialog")
    page.wait_for_load_state("networkidle")
    expect_text(page, "h1", "Dialog 对话框")
    page.get_by_role("button", name="打开对话框").first.click()
    dialog = page.locator(".el-dialog.ga-dialog").first
    dialog.wait_for()
    dialog_box = dialog.bounding_box()
    assert dialog_box is not None and dialog_box["width"] > 0
    page.locator('[data-action="toggle-source"]').first.click()
    page.locator('[data-testid="source-code"]').first.wait_for()
    assert_no_page_overflow(page)
    page.screenshot(path=OUTPUT / "dialog-1440.png", full_page=True)

    page.goto(f"{BASE_URL}/components/mega-menu")
    page.wait_for_load_state("networkidle")
    preview = page.locator(".ga-docs-demo__surface .ga-mega-menu").first
    preview.wait_for()
    preview_box = preview.bounding_box()
    assert preview_box is not None and preview_box["width"] > 0

    hover_trigger = page.get_by_role("radio", name="悬停").first
    hover_trigger.check(force=True)
    assert hover_trigger.is_checked()
    page.get_by_role("button", name="恢复案例").first.click()
    click_trigger = page.get_by_role("radio", name="点击").first
    click_trigger.wait_for()
    assert click_trigger.is_checked()
    assert not page.get_by_role("radio", name="悬停").first.is_checked()
    expect_text(page, "h1", "MegaMenu 大型菜单")
    assert_no_page_overflow(page)

    page.get_by_role("button", name="切换深色模式").click()
    state = page.evaluate(
        """() => ({
          docsDark: document.documentElement.classList.contains('ga-docs-dark'),
          elementDark: document.documentElement.classList.contains('dark'),
        })"""
    )
    assert state == {"docsDark": True, "elementDark": False}, state

    page.set_viewport_size({"width": 1024, "height": 900})
    page.goto(f"{BASE_URL}/components/search-bar")
    page.wait_for_load_state("networkidle")
    expect_text(page, "h1", "SearchBar 搜索栏")
    search_bar = page.locator(".ga-docs-demo__surface .ga-search-bar").first
    search_bar.wait_for()
    search_bar_box = search_bar.bounding_box()
    assert search_bar_box is not None and search_bar_box["width"] > 0
    assert_no_page_overflow(page)
    page.screenshot(path=OUTPUT / "search-bar-1024.png", full_page=True)

    assert runtime_errors == [], runtime_errors
    browser.close()
