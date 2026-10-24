# 全角色手办：本地接入记录

本记录描述 2026-10-24 在 Windows 工作区执行的接入与验证。`DELIVERY.md`、各 audit JSON 和规格表保留 Dots 的交付原文；其中的 Blender 重开记录、参考图核验和云端性能数据属于制作方报告。

## 接入范围

- 输入为 `Magical_Athlete_Final_01_of_13.zip` 至 `13_of_13.zip`。13 包 CRC 检查通过，共 1,528 个文件，无重复路径；先安全解压到忽略目录，再导入指定任务文件。
- 制作基线 `7467c208b3247af9d4348616366af63bac4f7311`，本地接入基线 `3f5427e`；补丁预检通过，工作分支为 `codex/all-character-sculpt`。
- 覆盖原版 36、Second Wind 36、Extra Mile 31、Leaf 18、Wurstii 30，共 151 名角色；另含 Bite Mark 变身与独立野猪。121 个运行 GLB 包含既有高低质量版本，120 个 Blender 文件包含合并源工程，不能用文件数量代替角色数量。
- 使用交付中的缓存版本号 `authored-sculpt-final-20261024`；原版总包、香蕉独立覆盖和各扩展资源路由同步更新。
- 原版高包 1,871,764 字节 / 202,453 三角面，低包 1,061,300 字节 / 76,199 三角面；每包 36 个角色绘制单元。预算断言保留。其他扩展沿用同几何的两档材质，不新增独立低模。
- 既有规则、角色 ID、技能、地图、Whirly 六组传送、二维头像未修改。

## 接入时的补充修正

1. 制作方为保留 PBR 通道调用了 `MeshStandardMaterial.copy`，但该方法会清掉高画质材质的 `PHYSICAL` 着色标记。本地补回标记并加入回归断言，保证 clearcoat/specular 参数生效。
2. 将逐顶点静态绑定、独立实例和恢复动画检查从抽样扩展到全部 121 个运行 GLB，覆盖所有角色、模块及高低包。
3. 专用 Playwright 配置在 Windows 默认使用 Edge；允许显式指定浏览器路径。新美术测试的截图和统计写入忽略目录 `tmp/sculpt-local/`，不覆盖制作方证据；加入浏览器 console error 检查，捕捉着色编译等不会触发 pageerror 的问题。
4. 截图复核发现原坐骑测试在展示序列结束前拍照，模型总数为 5 不能证明坐骑转移。补充真实场景树中坐骑归属断言，分别确认野猪位于骑士、马力欧模型之下，再等待展示结束截图。两档专项复验通过。

## 本地验证

- 286 项资源、材质、静态绑定、动画、头像、恢复、相机与棋盘显示检查通过。其中 121 项逐资源检查遍历实际 GLB 顶点，验证减少动效的静态姿态与有骨骼姿态一致。
- 首轮专用游戏验收 57/57 通过：151 个角色分批在 1280 桌面高画质和 360 手机尺寸低画质载入；另覆盖拥挤重复实例、6 个代表角色的实掷移动及技能/倒地/起立展示、两档变身及跨角色坐骑、资源失败恢复、三种视口的高低画质。
- 高画质着色标记修正后，19 项相关场景复验通过；坐骑归属断言加强后，2 项形态切换专项再次通过。后两轮同时检查控制台错误。
- 最终 `pnpm typecheck`、`pnpm build` 通过；检查正常 Node 客户端和浏览器部署产物均不含 `__ART_QA_SCENE__` 观察入口。
- 首轮日志：`tmp/sculpt-local-unit-final.txt`、`tmp/sculpt-local-browser.txt`；最终复验日志：`tmp/sculpt-local-browser-final.txt`、`tmp/sculpt-local-typecheck-final.txt`、`tmp/sculpt-local-build-final.txt`。
- 坐骑最终复验日志：`tmp/sculpt-local-forms-final.txt`。

本机最终画面：[桌面高画质](../qa/sculpt-integration/desktop-high.png)、[手机尺寸低画质](../qa/sculpt-integration/mobile-low.png)、[马力欧手机尺寸](../qa/sculpt-integration/mario-mobile.png)、[骑士骑乘](../qa/sculpt-integration/knight-mounted.png)、[马力欧骑乘](../qa/sculpt-integration/mario-mounted.png)、[马力欧骑乘手机尺寸](../qa/sculpt-integration/mario-mounted-mobile.png)。骑乘侧面图使用观察相机，桌面和手机普通场景保留游戏原有相机。

复现资源检查使用 [DELIVERY.md](DELIVERY.md) 中的 14 文件测试命令；该命令目前运行 286 项。游戏观察验收：

```sh
node scripts/art-qa-build.mjs
pnpm exec playwright test -c playwright.sculpt.config.ts
pnpm build
```

最后一步恢复正常生产构建，专用观察入口不应进入发布包。

## 验证边界

本机验证实际 GLB 解码、资源覆盖、显示、材质、绑定和代表动作；未在本机 Blender 重新打开源工程，也未重新完成制作方的参考图考证。部分侧背结构属于立体设计补全，Leaf 的原作者图缺失仍按交付记录披露。

浏览器验证使用本机桌面 Edge；360/390 宽度是视口模拟，不是实体手机 GPU、温度或内存测试。技能/倒地/起立与形态切换的专项场景部分使用服务器测试夹具，不能视为全部技能连锁规则复测。多人同格仍可能遮挡角色身体。构建既有的大 JavaScript 分块提示仍存在。

此次记录对应本地接入，不代表已经推送、创建新 PR、合并或上线。
