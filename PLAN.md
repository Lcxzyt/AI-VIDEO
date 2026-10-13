# 复刻开发计划

分镜依据见 `storyboard.md`。原始分析数据：`reference/analysis/`（分段报告 `chunk_reports.md`、逐帧差分 `motion_diff.txt`）。

## 1. 目录架构

```
src/
  index.ts / Root.tsx          # 注册 RainorbFilm（1280×720，30fps，4410 帧）；保留现有 NovaPromo
  film/
    RainorbFilm.tsx            # 唯一总装：背景 + 场景序列 + 全局层（顶栏 / 音频）
    timeline.ts                # 集中式时间轴（唯一的时间来源）
    theme.ts                   # 颜色、字体、尺寸 token
    beats.ts                   # BPM=100，beat(n) → 帧，节拍对齐工具
    scenes/
      S01ChatAsk.tsx … S15ChatOutro.tsx   # 每个分镜一个文件
      s08/ StarfieldCode.tsx  WaveLines.tsx  CityNight.tsx  Mountains.tsx  Sunset.tsx
      s09/ QuadPanel.tsx  Panorama.tsx
      s12/ ThumbGrid.tsx  InspectZoom.tsx
    components/                # 可复用组件（见第 3 节）
    hooks/ useSceneFrame.ts
public/
  (audio)                      # 原音轨的使用权确认之前不加入；只用于节拍和波形分析
```

## 2. 全局时间轴设计

`src/film/timeline.ts` 导出场景表（P2 已实现）。**所有区间都是半开区间 `[from, to)`**：`from` 是第一帧，`to` 是之后第一帧不再渲染，时长 = `to - from`，全局帧 0–4409。

| 场景 | from | to | 边界依据 |
|---|---|---|---|
| S01 ChatAsk | 0 | 128 | 发送形变 117–127 |
| S02 ChatReply | 117 | 286 | 淡出 275–285 |
| S03 Manifesto | 275 | 523 | 退出 506–522，523 静止 |
| S04 TitleCard | 506 | 722 | 标题缩进顶栏 684–707 |
| S05 FiveSteps | 721 | 1024 | 721 起有变化（差分 0.40） |
| S06 MusicMap | 1013 | 1328 | 收束 1013–1025 |
| S07 CodeWrite | 1316 | 1591 | 1585 单帧瞬切 |
| S08 SceneMontage | 1585 | 2067 | 从 1585 瞬切开始；2017–2066 十字切分 |
| S09 CloneSplit | 2017 | 2536 | 2017 起切分（差分 5.19） |
| S10 ComposeCards | 2536 | 3025 | 卡片约 2536 稳定 |
| S11 PreviewPlay | 3025 | 3196 | 3025 跳变 |
| S12 ReviewTimeline | 3196 | 3745 | 3745 计数器停住 |
| S13 Rewind | 3745 | 4047 | 倒带；4033–4058 内容收缩 |
| S14 PixelTitle | 4033 | 4332 | 4033 开始收缩进入；4320 切换 |
| S15 ChatOutro | 4320 | 4410 | 4320 计数器恢复 f+1 |

相邻场景的重叠区间是 `[b.from, a.to)`，两个场景同时渲染，`layer` 更大的画在上层。`tests/timeline.test.ts` 检查每帧都有覆盖、没有越界帧、边界按半开区间归属、同一帧最多两个场景重叠。

规则：
- 总装层对每个场景使用 `<Sequence from={s.from} durationInFrames={s.to - s.from}>`。场景内部只用 `useCurrentFrame()`，它返回的是**局部帧**。
- 场景内部的关键点写成局部常量，例如 `const T = { typeStart: 20, typeEnd: 113 }`，附注释说明对应的全局帧，方便与原片对照。
- 需要全局帧的元素（顶栏计数器、节拍）只放在全局层，通过 `useGlobalFrame()` 读取（基于 `Sequence` 的偏移计算，或者直接放在根层）。
- 进入和退出转场由各场景自己负责（在重叠区里淡入或形变），不用 `TransitionSeries`。原因：原片没有切换，而是持续形变，重叠时两个场景需要同时渲染。
- 跨场景的连续元素（吉祥物、顶栏中间的小标题、对话气泡）：前一场景结尾状态和后一场景开头状态共用 `theme.ts` 里同一组坐标常量，保证衔接处位置一致。
- S13 倒带需要重放前面的场景：把各场景组件当作纯函数，用 `<Freeze frame={…}>` 或者传入 `frameOverride`，渲染指定局部帧，不另写一套画面。
- 校验：`npm test`（`tests/timeline.test.ts`、`tests/counter.test.ts`）。

## 3. 可复用组件清单

| 组件 | 用途（场景） | 关键 props |
|---|---|---|
| `PixelMascot` | 全片 | `size`、`pose: idle/walk/jump/sit/loading/magnifier`、`x/y`；待机浮动由组件内部驱动 |
| `TopBar` | 除 S14 外 | `showTitle`、`counterOverride?: number`（倒带用）、`opacity` |
| `FrameCounter` | 顶栏、S10 大号计数 | `value`、`digits=4`、`variant: bar/big` |
| `Typewriter` | S01、S02、S04、S15 | `text`、`startFrame`、`framesPerChar` 或逐字时间表、`highlights: [{range,color}]`、`cursor` |
| `BlinkCursor` | 打字处 | `period` |
| `HighlightText` | 字幕和关键词着色 | `segments` |
| `Caption` | 底部字幕（S06、S07、S09、S12、S14） | `text`、`highlight`、`enter` |
| `ChatInput` / `ChatBubble` | S01、S02、S15 | `value`、`placeholder`、`sendActive` |
| `StrikeList` | S03（S13 回放） | `items`、`strikeAt` |
| `LineIcon` | 摄像机、胶片、剪辑、代码、播放、倒带 | `name` |
| `HandDrawnEllipse` | S05 | `progress` |
| `StepBar` / `StepBox` | S05、S06、S13 | `active`、`layout: tree/row` |
| `Waveform` | S06（灰色）、S12（橙红色条） | `peaks`（由音轨预计算成 JSON）、`progress`、`markers` |
| `CodePane` | S07、S08 闪回 | `lines`、`scroll`、`columns` |
| `ParticleField` | S08 星空、粒子爆发 | `seed`（`random()`，确定性）、`mode` |
| `GlowOrb` | 月、日 | `kind`、`color` |
| `Skyline` / `Mountains` / `WaveLines` / `Sailboat` | S08、S09 | `progress` |
| `FilmCard` | S09–S12 卡片和缩略图 | `children`、`tilt`、`highlight` |
| `Background` | 全片 | 暖棕底色 + 径向光晕，`glowPos` |
| `PixelateReveal` | S14 | `text`、`progress`（块大小从大到小，用 canvas 或 SVG 栅格） |

## 4. 分阶段任务（每项可单独验收）

| 阶段 | 任务 | 验收标准 |
|---|---|---|
| P2 基础设施 | 注册 `RainorbFilm`；`timeline.ts`、`theme.ts`、`beats.ts`；`Background`、`TopBar`、`FrameCounter`；对比脚本。（按你的要求：原音轨不嵌入成片，只用于分析） | `tsc` 和 `eslint` 通过；时间轴没有缺帧、越界帧；计数器与已确认的采样一致；Studio 能预览完整 147s |
| P3 吉祥物 | `PixelMascot` 的全部姿态（以原片放大帧为准，按像素网格还原） | 与原片 6 处放大截图并排对比，外形一致 |
| P4 | S01–S02 对话 + `Typewriter`、`ChatInput`、`ChatBubble` | 帧 0/60/113/128/200/260 对比 |
| P5 | S03–S04 清单 + 片名 | 帧 300/400/470/560/650/700 |
| P6 | S05–S06 五步 + 音乐图 | 帧 760/900/1000/1100/1250 |
| P7 | S07 代码 | 帧 1340/1400/1450/1500 及拍点脉冲 |
| P8 | S08 场景蒙太奇（5 个子组件） | 每个子场景各 1–2 帧 |
| P9 | S09 分身四格到全景 | 帧 2100/2300/2460/2530 |
| P10 | S10–S11 卡片、计数、预览 | 帧 2620/2800/2950/3100/3170 |
| P11 | S12 检查时间线 | 帧 3250/3350/3500/3700 |
| P12 | S13 倒带（复用前面的场景） | 计数器倒数序列；帧 3800/3900/4000 |
| P13 | S14–S15 像素巨字 + 结尾 | 帧 4100/4200/4350/4409 |
| P14 | 全片整体校验 | 全部关键帧 PSNR/SSIM 报告；连续性检查；一次完整渲染（经你确认后进行） |

每个阶段结束时更新 `PROGRESS.md`。

## 5. 原片与渲染帧对比方案

1. 关键帧清单 `reference/analysis/keyframes.json`：每个场景 3–6 帧，取开始、动画中途、稳定状态、转场中点。
2. 抽原片帧：`ffmpeg -ss <frame/30> -i reference/reference.mp4 -frames:v 1 ref_<frame>.png`（使用 `-vf "select=eq(n\,F)"` 精确到帧）。
3. 渲染同一帧：`npx remotion still RainorbFilm --frame=F out/cmp/ren_F.png`。
4. 对比输出：
   - 并排图和差异热图：`ffmpeg … -filter_complex "[0][1]blend=all_mode=difference"` 加 hstack，便于人工检查；
   - 数值：`ffmpeg -lavfi ssim` / `psnr`，写入 `out/cmp/report.md`。
5. 阈值（参考值）：静止状态的帧 SSIM ≥ 0.90；转场中途的帧以人工检查为主，SSIM 只作参考（文字抗锯齿和字体差异会拉低分数）。
6. 时间对齐抽查：按 `motion_diff.txt` 的运动峰位置，对渲染结果也算差分曲线，两条曲线叠加比较，峰值偏差 ≤ 2 帧。
7. 所有脚本放在 `scripts/compare/`，输出放到 `out/`（已被 gitignore）。

## 6. 风险与决策点（需要你确认）
- 音频：直接从参考视频抽出音轨使用，是最快且保证同步的方案。前提是你有权使用这段音乐。
- 字体：原片标题为宋体风格衬线，正文为无衬线。计划使用 Noto Serif SC / Noto Sans SC（`@remotion/google-fonts`，需要新增依赖）。
- 现有的 `NovaPromo`（Composition.tsx、FeatureCard.tsx 有未提交的修改）原样保留，只在 Root 里新增一个 Composition。
