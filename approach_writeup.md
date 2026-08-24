# Technical Assessment Approach: Voice Command Shopping Assistant

### Architectural Approach & Engineering Design (194 words)

VoiceCart is built with a local-first, privacy-focused architecture combining native browser Web Speech APIs with a custom deterministic Natural Language Understanding (NLU) pipeline and hybrid acoustic speech normalization.

To eliminate latency and external API costs, the NLU engine uses rule-based slot filling, Soundex phonetic encoding, and Jaro-Winkler string similarity. This guarantees sub-50ms intent classification, multi-item clause splitting (*"add atta and 2 packets milk"*), prefix/suffix quantity extraction (*"milk 2 packets"* / *"2 packets milk"*), and automatic acoustic distortion recovery (*"hotels"* $\rightarrow$ *"bottles"*).

State management follows a unidirectional reactive pattern in React 18 with strict TypeScript typing. Grocery items are automatically organized by department (Produce, Dairy, Bakery, Pantry) with real-time Indian Rupee (₹) pricing, GST breakdown, and dietary substitute recommendations.

For seamless cross-device usage, VoiceCart implements a local-first caching layer paired with an encrypted 6-digit sync key protocol, allowing real-time cart and routine consumption mirroring between mobile and laptop. A continuous Web Speech lifecycle state machine with dynamic silence debouncing and Chrome audio keep-alive ensures smooth, hands-free voice interactions across desktop and mobile browsers.
