x image-generation 初始化 Image-Generation 项目并提交第一版
x image-generation 重构项目结构，新增逐张确认和智能跳过机制
x image-generation 新增风格库，提供 9 种预设图像风格
x image-generation 移除未使用的脚本文件
x image-generation 大幅简化项目结构和文档，净减少 1356 行代码
x image-generation 优化输出目录命名和错误调试
x pw-skills 重组项目为多技能仓库结构
x pw-skills 新增 RedBook-Image 小红书图片生成技能
x pw-skills 为技能目录添加统一的 pw 前缀
x pw-skills 简化技能结构并统一命名规范（删除冗余 README，重命名为小写）
x pw-skills 重命名 references 为 config.example
x pw-skills 重命名脚本文件以提高可读性（merge-to-pptx.js, merge-to-long-image.js）
x pw-skills 改进功能可发现性（更新 description 和"什么时候用"）
x pw-skills 优化 pw-redbook-image 描述使其更清晰直观
x pw-skills 强调视觉一致性的重要性（新增专门章节）
x pw-skills 添加 API Key 获取链接和注册提示
x pw-skills 强调作者信息一致性和优化提示可见性
x pw-skills 添加 pw-cover-image 封面图生成技能
x pw-skills 移植 pw-post-to-wechat 微信公众号发布工具
x pw-skills 应用 Claude Agent Skills 最佳实践优化所有 pw 技能文档
x pw-image-generation 重构为 TypeScript，使用 Bun 运行，移除 node_modules 依赖