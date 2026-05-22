export const authService = {
    async appInfo() {
        let language = 'en'
        try {
            const settingsConfig = JSON.parse(
                localStorage.getItem("settingsConfig") || "{}"
            )
            if (settingsConfig.language) {
                language = settingsConfig.language
            } else {
                // Get browser language setting
                const browserLang = navigator.language.toLowerCase()
                // Set to Chinese if browser language is Chinese, otherwise English
                language = browserLang.startsWith("zh") ? "zh" : "en"
            }
        } catch (error) {
            console.log(error)
        }

        const BASE = process.env.APP_BASE_URL || "";
        const res = await fetch(`${BASE}/api/appInfo?language=${language}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        const data = await res.json()
        if (!res.ok) throw data
        return data
    },
}
