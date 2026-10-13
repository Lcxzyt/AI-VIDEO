# 进度记录

## 阶段 1：参考解析与规划（2026-10-13 完成，等待用户确认）
- 已核实：1280×720、30fps、4410 帧、AAC 48kHz；全片无硬切；音乐 100 BPM（每拍 18 帧）；帧计数器显示值 = 全局帧 + 1；S13 期间计数器倒数。
- 产出：`storyboard.md`（15 个分镜）、`PLAN.md`（架构、时间轴、组件、任务、对比方案）、`reference/analysis/`（分段报告、逐帧差分）。
- 未改动任何 `src/` 代码；现有 NovaPromo 保留。
- 待你确认：音频直接取自原片；新增 `@remotion/google-fonts` 依赖；开始 P2。
- 下一个会话从 `PLAN.md` 第 4 节的 P2 开始。

## 阶段 2：基础设施（2026-10-13 完成，等待用户确认）

### 实际修改的文件
- 新增 `src/film/`：
  - 核心模块：`RainorbFilm.tsx`、`timeline.ts`、`counter.ts`、`theme.ts`、`fonts.ts`、`beats.ts`
  - Hook：`hooks/useGlobalFrame.ts`、`hooks/useSceneFrame.ts`
  - 组件：`components/Background.tsx`、`components/TopBar.tsx`、`components/FrameCounter.tsx`
  - 临时画面：`scenes/Placeholder.tsx`
  - 数据：`data/counterRewind.ts`（由脚本生成）、`data/counterMove.ts`
- 修改 `src/Root.tsx`：在 NovaPromo 之后新增注册 `RainorbFilm`（1280×720、30fps、4410 帧）。`Composition.tsx`、`FeatureCard.tsx` 没有改动。
- `package.json` / `package-lock.json`：新增 `@remotion/google-fonts@4.0.535`（锁定版本）；新增 `test` 脚本。
- 新增 `tests/`：`ts-resolve.mjs`、`timeline.test.ts`、`counter.test.ts`。
- 新增 `scripts/compare/`：
  - `compare.sh`：精确按帧号抽原片帧，渲染静帧，输出并排图、差异图和 SSIM/PSNR 报告，写入 `out/cmp/report.md`。
  - `crop.sh`：区域放大对比。
- 新增 `scripts/analysis/`：`counter_ocr.py`、`gen_counter_table.mjs`、`sample_pixels.py`、`col_profile.py`。
- 新增 `reference/analysis/`：`verification_p2.md`（冲突核实）、`counter_reference.tsv`（全片 4410 帧计数器 OCR）、`keyframes.json`。
- 修改 `storyboard.md`（按核实结果修正，修正处标注“P2 修正”）和 `PLAN.md`（时间轴改为半开区间表；音频方案改为不嵌入原音轨）。

### 测试结果
- `npm run lint`（eslint + tsc，tsc 也检查 tests/）：通过。
- `npm test`：14/14 通过。
  - 时间轴：0–4409 每帧都有场景覆盖；没有越界帧；`from`/`to` 单调；最后的 `to` = 4410；`to` 帧只属于下一个场景；同一帧最多 2 个场景重叠；层级顺序正确；全局帧和局部帧可以互相换算。
  - 计数器：与 OCR 参考表逐帧比较，全部 4123 个可读帧（count + rewind）完全一致；另外 17 个确认过的采样点也一致。
- Studio：`npx remotion studio` 启动正常（HTTP 200）；`remotion compositions` 列出 `RainorbFilm 30 1280x720 4410 (147.00 sec)` 和 `NovaPromo`。
- 对比工具：在 10 帧上跑通。SSIM 0.65–0.93，偏低是因为场景内容还是临时画面。顶栏区域放大对比：logo、标题、计数器的位置与原片基本吻合。

### 时间轴的调整
- 原 PLAN 的表格按半开区间算有 7 处 1 帧空缺，已按实测边界修正，见 PLAN.md 第 2 节。
- 变动较大的边界：S08 从 1585 开始（单帧瞬切）；S14 从 4033 开始（画面开始收缩）。

### 未解决的问题
- 场景全部是临时画面（品红虚线框，标注“TEMP — NOT REPLICATED”），**不算复刻完成**。
- bilibili 字标暂时用文字代替，需要描成 SVG。
- 字体是暂定的 Noto Serif SC / Noto Sans SC / Noto Sans Mono，字重、字号、字距需要对照关键帧调整。
- 节拍相位没有确定（见 verification_p2.md 第 5 节）。`beats.ts` 只提供 18 帧间隔，每个场景要按实测拍点对齐。
- 帧 3885 的计数值可能有 ±1 误差。
- 帧 710 在 y 72–73 处的细线：来源未定。
- 音轨是否带人声：未核实。
- 3169、519、3025、3848 的瞬切内容还没有逐帧目视确认。
- 音频：按你的要求没有嵌入成片。

### 下一阶段（P3 吉祥物，等待确认后开始）
- 放大原片中的吉祥物帧，按像素网格还原 `PixelMascot` 的全部姿态。
- 和原片 6 处放大截图并排对比。
