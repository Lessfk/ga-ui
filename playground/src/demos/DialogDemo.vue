<template>
  <section class="dialog-demo">
    <header class="demo-toolbar">
      <div class="demo-toolbar__title">
        <h2>GaDialog 完整 API</h2>
        <div class="demo-toolbar__status">
          <ElTag :type="dialogVisible ? 'success' : 'info'" effect="plain">
            {{ dialogVisible ? '已打开' : '已关闭' }}
          </ElTag>
          <span>{{ currentScenario.label }}</span>
          <span>{{ dialogFullscreen ? '全屏' : dialogWidth }}</span>
        </div>
      </div>

      <div class="demo-toolbar__actions">
        <ElButton :icon="Refresh" @click="resetDemo">恢复默认</ElButton>
        <ElButton
          :icon="RefreshRight"
          :disabled="!dialogVisible || dialogFullscreen"
          @click="resetDialogPosition"
        >
          重置位置
        </ElButton>
        <ElButton
          :icon="Close"
          :disabled="!dialogVisible"
          @click="requestClose"
        >
          关闭弹窗
        </ElButton>
      </div>
    </header>

    <div class="demo-controls">
      <div class="control-group control-group--fields">
        <span class="control-group__title">尺寸与位置</span>

        <label class="field-control">
          <span>宽度</span>
          <ElSegmented v-model="dialogWidth" :options="widthOptions" />
        </label>

        <label class="field-control field-control--number">
          <span>顶部距离</span>
          <ElInputNumber
            v-model="topOffset"
            :disabled="alignCenter || dialogFullscreen"
            :min="2"
            :max="24"
            :step="1"
            controls-position="right"
            size="small"
          />
          <small>vh</small>
        </label>
      </div>

      <div class="control-group control-group--switches">
        <span class="control-group__title">布局行为</span>

        <label class="switch-control">
          <span>垂直居中</span>
          <ElSwitch v-model="alignCenter" />
        </label>
        <label class="switch-control">
          <span>内容居中</span>
          <ElSwitch v-model="center" />
        </label>
        <label class="switch-control">
          <span>允许拖拽</span>
          <ElSwitch v-model="draggable" />
        </label>
        <label class="switch-control">
          <span>挂载到 body</span>
          <ElSwitch v-model="appendToBody" />
        </label>
        <label class="switch-control">
          <span>关闭时销毁</span>
          <ElSwitch v-model="destroyOnClose" />
        </label>
      </div>

      <div class="control-group control-group--switches">
        <span class="control-group__title">关闭与标题栏</span>

        <label class="switch-control">
          <span>关闭按钮</span>
          <ElSwitch v-model="showClose" />
        </label>
        <label class="switch-control">
          <span>全屏按钮</span>
          <ElSwitch v-model="showFullscreen" />
        </label>
        <label class="switch-control">
          <span>遮罩关闭</span>
          <ElSwitch v-model="closeOnClickModal" />
        </label>
        <label class="switch-control">
          <span>ESC 关闭</span>
          <ElSwitch v-model="closeOnPressEscape" />
        </label>
        <label class="switch-control">
          <span>关闭前确认</span>
          <ElSwitch v-model="closeGuard" />
        </label>
      </div>
    </div>

    <div class="scenario-bar">
      <div class="scenario-bar__heading">
        <strong>使用场景</strong>
        <span>共用一个 GaDialog 实例</span>
      </div>

      <div class="scenario-bar__actions">
        <ElButton
          v-for="scenario in scenarios"
          :key="scenario.key"
          :type="activeScenario === scenario.key ? 'primary' : 'default'"
          :icon="scenario.icon"
          @click="openScenario(scenario.key)"
        >
          {{ scenario.label }}
        </ElButton>
      </div>
    </div>

    <footer class="demo-footer">
      <div class="state-summary">
        <strong>当前状态</strong>
        <code>visible: {{ dialogVisible }}</code>
        <code>fullscreen: {{ dialogFullscreen }}</code>
        <code>scenario: {{ activeScenario }}</code>
        <code>alignCenter: {{ alignCenter }}</code>
        <code>draggable: {{ draggable }}</code>
        <code>beforeClose: {{ closeGuard }}</code>
      </div>

      <div class="event-log">
        <div class="event-log__header">
          <strong>事件日志</strong>
          <ElButton
            link
            :disabled="eventLogs.length === 0"
            @click="eventLogs = []"
          >
            清空
          </ElButton>
        </div>

        <div class="event-log__items">
          <span v-if="eventLogs.length === 0" class="event-log__empty">
            暂无弹窗事件
          </span>
          <code v-for="event in eventLogs" :key="event.id">
            <time>{{ event.time }}</time>
            <span>{{ event.name }}</span>
            <small v-if="event.detail">{{ event.detail }}</small>
          </code>
        </div>
      </div>
    </footer>

    <GaDialog
      ref="dialogInstance"
      v-model="dialogVisible"
      v-model:fullscreen="dialogFullscreen"
      class="dialog-demo-instance"
      :title="currentScenario.title"
      :width="dialogWidth"
      :top="dialogTop"
      :append-to-body="appendToBody"
      :destroy-on-close="destroyOnClose"
      :center="center"
      :align-center="alignCenter"
      :draggable="draggable"
      :show-close="showClose"
      :show-fullscreen="showFullscreen"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :before-close="closeGuard ? handleBeforeClose : undefined"
      modal-class="ga-dialog-demo-modal"
      header-aria-level="2"
      @update:model-value="handleVisibleUpdate"
      @update:fullscreen="handleFullscreenUpdate"
      @open="recordEvent('open')"
      @opened="recordEvent('opened')"
      @close="recordEvent('close')"
      @closed="handleClosed"
      @open-auto-focus="recordEvent('open-auto-focus')"
      @close-auto-focus="recordEvent('close-auto-focus')"
    >
      <template
        v-if="activeScenario === 'custom'"
        #header="{ close, titleId, titleClass }"
      >
        <div class="custom-dialog-header">
          <div class="custom-dialog-header__title">
            <span
              :id="titleId"
              :class="titleClass"
              role="heading"
              aria-level="2"
            >
              {{ currentScenario.title }}
            </span>
            <ElTag type="warning" effect="plain" size="small">
              自定义 header
            </ElTag>
          </div>

          <ElButton
            text
            circle
            :icon="Close"
            title="关闭"
            aria-label="关闭"
            @click="close"
          />
        </div>
      </template>

      <div class="dialog-content" :class="`is-${activeScenario}`">
        <template v-if="activeScenario === 'basic'">
          <div class="dialog-heading">
            <strong>订单审批</strong>
            <ElTag type="warning" effect="light">待处理</ElTag>
          </div>

          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="订单编号">GA-20260826</ElDescriptionsItem>
            <ElDescriptionsItem label="申请部门">运营中心</ElDescriptionsItem>
            <ElDescriptionsItem label="申请人">林晓</ElDescriptionsItem>
            <ElDescriptionsItem label="申请金额">¥ 28,600.00</ElDescriptionsItem>
          </ElDescriptions>

          <ElAlert
            title="该订单包含跨区域交付，需要确认结算周期。"
            type="info"
            :closable="false"
            show-icon
          />
        </template>

        <template v-else-if="activeScenario === 'custom'">
          <div class="custom-dialog-body">
            <span class="custom-dialog-body__mark">GA</span>
            <div>
              <strong>自定义标题栏内容</strong>
              <p>标题、状态标记和关闭命令均由 header 作用域插槽渲染。</p>
            </div>
          </div>

          <ul class="activity-list">
            <li>
              <span>10:18</span>
              <strong>订单已提交至区域负责人</strong>
            </li>
            <li>
              <span>10:42</span>
              <strong>财务资料校验完成</strong>
            </li>
            <li>
              <span>11:06</span>
              <strong>等待最终审批</strong>
            </li>
          </ul>
        </template>

        <ElForm
          v-else-if="activeScenario === 'form'"
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          label-position="right"
          label-width="88px"
          status-icon
        >
          <ElFormItem label="任务名称" prop="name">
            <ElInput
              v-model="formModel.name"
              maxlength="40"
              show-word-limit
              placeholder="请输入任务名称"
            />
          </ElFormItem>

          <ElFormItem label="负责部门" prop="department">
            <ElSelect
              v-model="formModel.department"
              placeholder="请选择负责部门"
              style="width: 100%"
            >
              <ElOption
                v-for="department in departmentOptions"
                :key="department"
                :label="department"
                :value="department"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="任务说明" prop="description">
            <ElInput
              v-model="formModel.description"
              type="textarea"
              :rows="4"
              maxlength="200"
              show-word-limit
              placeholder="请输入任务说明"
            />
          </ElFormItem>
        </ElForm>

        <div v-else class="long-content">
          <section v-for="section in longSections" :key="section.title">
            <div>
              <strong>{{ section.title }}</strong>
              <ElTag size="small" effect="plain">{{ section.status }}</ElTag>
            </div>
            <p>{{ section.content }}</p>
          </section>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-actions">
          <ElButton
            v-if="activeScenario === 'long'"
            :icon="RefreshRight"
            :disabled="dialogFullscreen"
            @click="resetDialogPosition"
          >
            重置位置
          </ElButton>

          <span class="dialog-footer-actions__spacer" />

          <ElButton :disabled="submitLoading" @click="requestClose">
            取消
          </ElButton>
          <ElButton
            type="primary"
            :loading="submitLoading"
            @click="handleConfirm"
          >
            {{ activeScenario === 'form' ? '保存' : '确认' }}
          </ElButton>
        </div>
      </template>
    </GaDialog>
  </section>
</template>

<script setup lang="ts">
import {
  Close,
  Document,
  EditPen,
  Refresh,
  RefreshRight,
  Tickets,
} from '@element-plus/icons-vue'
import {
  ElAlert,
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSegmented,
  ElSelect,
  ElSwitch,
  ElTag,
} from 'element-plus'
import type {
  DialogBeforeCloseFn,
  FormInstance,
  FormRules,
} from 'element-plus'
import { computed, nextTick, reactive, ref } from 'vue'

import { GaDialog } from 'ga-ui-plus/base'
import type { GaDialogExpose } from 'ga-ui-plus/base'

type ScenarioKey = 'basic' | 'custom' | 'form' | 'long'

interface DemoEvent {
  id: number
  name: string
  detail?: string
  time: string
}

const scenarios = [
  {
    key: 'basic',
    label: '基础弹窗',
    title: '订单审批',
    icon: Document,
  },
  {
    key: 'custom',
    label: '自定义头部',
    title: '流程动态',
    icon: Tickets,
  },
  {
    key: 'form',
    label: '表单弹窗',
    title: '新建协作任务',
    icon: EditPen,
  },
  {
    key: 'long',
    label: '长内容',
    title: '交付检查清单',
    icon: RefreshRight,
  },
] as const

const widthOptions = [
  { label: '紧凑 480', value: '480px' },
  { label: '标准 640', value: '640px' },
  { label: '宽屏 760', value: '760px' },
]

const departmentOptions = ['产品中心', '技术中心', '运营中心', '客户服务部']

const longSections = [
  {
    title: '需求范围确认',
    status: '已完成',
    content: '核对交付边界、业务负责人和验收口径，确保需求项均有明确归属。',
  },
  {
    title: '权限与账号',
    status: '进行中',
    content: '检查生产账号、角色权限和数据范围，记录所有临时权限的回收时间。',
  },
  {
    title: '数据迁移',
    status: '待确认',
    content: '确认迁移批次、校验规则、回滚方案以及迁移完成后的抽样结果。',
  },
  {
    title: '监控告警',
    status: '已完成',
    content: '配置服务可用性、关键业务指标和异常任务告警，并确认通知接收人。',
  },
  {
    title: '应急预案',
    status: '待确认',
    content: '补充故障分级、响应责任人、升级路径和关键操作的回退步骤。',
  },
  {
    title: '上线窗口',
    status: '进行中',
    content: '锁定发布时间、变更负责人、观察周期和发布后的业务验证顺序。',
  },
]

const defaultFormModel = {
  name: '',
  department: '',
  description: '',
}

const dialogInstance = ref<GaDialogExpose>()
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogFullscreen = ref(false)
const activeScenario = ref<ScenarioKey>('basic')
const dialogWidth = ref('640px')
const topOffset = ref(8)
const appendToBody = ref(true)
const destroyOnClose = ref(true)
const center = ref(false)
const alignCenter = ref(true)
const draggable = ref(true)
const showClose = ref(true)
const showFullscreen = ref(true)
const closeOnClickModal = ref(false)
const closeOnPressEscape = ref(false)
const closeGuard = ref(true)
const submitLoading = ref(false)
const bypassCloseGuard = ref(false)
const eventLogs = ref<DemoEvent[]>([])
const formModel = reactive({ ...defaultFormModel })

let eventId = 0

const formRules: FormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  department: [
    { required: true, message: '请选择负责部门', trigger: 'change' },
  ],
}

const currentScenario = computed(
  () =>
    scenarios.find((scenario) => scenario.key === activeScenario.value) ??
    scenarios[0],
)

const dialogTop = computed(() => `${topOffset.value}vh`)

function recordEvent(name: string, detail?: string) {
  eventLogs.value = [
    {
      id: ++eventId,
      name,
      detail,
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    },
    ...eventLogs.value,
  ].slice(0, 12)
}

function openScenario(key: ScenarioKey) {
  activeScenario.value = key
  dialogFullscreen.value = false
  dialogVisible.value = true
  recordEvent('scenario', key)

  if (key === 'form') {
    void nextTick(() => formRef.value?.clearValidate())
  }
}

function handleVisibleUpdate(value: boolean) {
  recordEvent('update:modelValue', String(value))
}

function handleFullscreenUpdate(value: boolean) {
  recordEvent('update:fullscreen', String(value))
}

const handleBeforeClose: DialogBeforeCloseFn = (done) => {
  recordEvent('before-close')

  if (bypassCloseGuard.value) {
    bypassCloseGuard.value = false
    done()
    return
  }

  void ElMessageBox.confirm(
    `确定关闭“${currentScenario.value.title}”吗？`,
    '关闭确认',
    {
      type: 'warning',
      confirmButtonText: '关闭',
      cancelButtonText: '继续处理',
      autofocus: false,
    },
  )
    .then(() => {
      recordEvent('before-close:confirm')
      done()
    })
    .catch(() => {
      recordEvent('before-close:cancel')
    })
}

function requestClose() {
  dialogInstance.value?.dialogRef?.handleClose()
}

function closeWithoutGuard() {
  bypassCloseGuard.value = true
  requestClose()
}

function resetDialogPosition() {
  dialogInstance.value?.dialogRef?.resetPosition()
  recordEvent('instance:resetPosition')
}

async function handleConfirm() {
  if (activeScenario.value === 'form') {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 700))
    submitLoading.value = false
    ElMessage.success('协作任务已保存')
  } else {
    ElMessage.success(`${currentScenario.value.title}已确认`)
  }

  closeWithoutGuard()
}

function handleClosed() {
  submitLoading.value = false
  bypassCloseGuard.value = false
  recordEvent('closed')
}

function resetDemo() {
  dialogWidth.value = '640px'
  topOffset.value = 8
  appendToBody.value = true
  destroyOnClose.value = true
  center.value = false
  alignCenter.value = true
  draggable.value = true
  showClose.value = true
  showFullscreen.value = true
  closeOnClickModal.value = false
  closeOnPressEscape.value = false
  closeGuard.value = true
  dialogFullscreen.value = false
  activeScenario.value = 'basic'
  Object.assign(formModel, defaultFormModel)
  formRef.value?.clearValidate()
  recordEvent('demo:reset')
}
</script>

<style scoped lang="scss">
.dialog-demo {
  --demo-border: #d9e0e8;
  --demo-muted: #667085;
  --demo-surface: #f7f9fb;

  min-width: 960px;
  padding: 22px 24px 28px;
  color: #1f2937;
  background: #ffffff;
}

.demo-toolbar,
.scenario-bar,
.demo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.demo-toolbar {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--demo-border);

  &__title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 18px;
  }

  &__title h2 {
    margin: 0;
    font-size: 20px;
    line-height: 28px;
  }

  &__status,
  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__status {
    color: var(--demo-muted);
    font-size: 13px;
  }
}

.demo-controls {
  display: grid;
  grid-template-columns: minmax(300px, 1.1fr) repeat(2, minmax(260px, 1fr));
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--demo-border);
}

.control-group {
  display: flex;
  min-width: 0;
  align-content: flex-start;
  gap: 12px 18px;

  &--fields {
    flex-direction: column;
  }

  &--switches {
    flex-wrap: wrap;
  }

  &__title {
    width: 100%;
    color: #344054;
    font-size: 13px;
    font-weight: 700;
  }
}

.field-control,
.switch-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #475467;
  font-size: 13px;
}

.field-control {
  justify-content: flex-start;

  > span:first-child {
    width: 64px;
    flex: 0 0 auto;
  }

  small {
    color: var(--demo-muted);
  }

  &--number :deep(.el-input-number) {
    width: 120px;
  }
}

.switch-control {
  width: calc(50% - 9px);
  min-width: 118px;
}

.scenario-bar {
  padding: 18px 0;

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__heading span {
    color: var(--demo-muted);
    font-size: 12px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
  }
}

.demo-footer {
  align-items: stretch;
  padding-top: 18px;
  border-top: 1px solid var(--demo-border);
}

.state-summary,
.event-log {
  min-width: 0;
  border: 1px solid var(--demo-border);
  border-radius: 6px;
  background: var(--demo-surface);
}

.state-summary {
  display: grid;
  width: 38%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 14px;
  padding: 14px;

  strong {
    grid-column: 1 / -1;
    font-size: 13px;
  }

  code {
    overflow: hidden;
    color: #475467;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.event-log {
  width: 62%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 12px 0 14px;
    border-bottom: 1px solid var(--demo-border);
  }

  &__header strong {
    font-size: 13px;
  }

  &__items {
    display: grid;
    max-height: 150px;
    overflow-y: auto;
  }

  &__items code {
    display: grid;
    grid-template-columns: 68px 150px minmax(0, 1fr);
    gap: 10px;
    padding: 7px 14px;
    color: #344054;
    font-size: 12px;
    border-bottom: 1px solid #e8edf3;
  }

  &__items time,
  &__items small,
  &__empty {
    color: var(--demo-muted);
  }

  &__empty {
    padding: 20px 14px;
    font-size: 12px;
  }
}

.dialog-content {
  display: grid;
  gap: 18px;
  min-height: 180px;
}

.dialog-heading,
.custom-dialog-header,
.custom-dialog-header__title,
.custom-dialog-body,
.activity-list li,
.long-content section > div,
.dialog-footer-actions {
  display: flex;
  align-items: center;
}

.dialog-heading,
.custom-dialog-header,
.long-content section > div {
  justify-content: space-between;
}

.dialog-heading strong {
  font-size: 16px;
}

.custom-dialog-header {
  width: 100%;
  gap: 16px;

  &__title {
    min-width: 0;
    gap: 10px;
    font-weight: 700;
  }
}

.custom-dialog-body {
  gap: 14px;
  padding: 16px;
  background: #f4f7fb;
  border-left: 3px solid #409eff;

  &__mark {
    display: inline-flex;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    background: #315c96;
    border-radius: 6px;
  }

  p {
    margin: 5px 0 0;
    color: #667085;
    font-size: 13px;
  }
}

.activity-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #e4e9f0;

  li {
    gap: 18px;
    min-height: 44px;
    border-bottom: 1px solid #e4e9f0;
  }

  span {
    width: 52px;
    color: #667085;
    font-size: 12px;
  }

  strong {
    font-size: 13px;
    font-weight: 600;
  }
}

.long-content {
  display: grid;
  max-height: 48vh;
  gap: 0;
  overflow-y: auto;
  border-top: 1px solid #e4e9f0;

  section {
    padding: 14px 4px;
    border-bottom: 1px solid #e4e9f0;
  }

  p {
    margin: 8px 0 0;
    color: #667085;
    font-size: 13px;
    line-height: 1.7;
  }
}

.dialog-footer-actions {
  width: 100%;
  gap: 10px;

  &__spacer {
    flex: 1;
  }
}

:global(.ga-dialog-demo-modal) {
  backdrop-filter: blur(2px);
}

:global(.dialog-demo-instance) {
  max-width: calc(100vw - 64px);
}
</style>
