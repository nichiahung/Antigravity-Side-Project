/**
 * 預產生 100 筆 DiceBear pixel-art 關主頭像 URL
 */
const AVATAR_COUNT = 100;

const avatarUrls = Array.from({ length: AVATAR_COUNT }, (_, i) =>
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=boss-${i}&backgroundColor=0f0f23`
);

/**
 * 隨機取得 N 個不重複的關主頭像 URL
 * @param {number} count
 * @returns {string[]}
 */
export function getRandomAvatars(count) {
    const shuffled = [...avatarUrls].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * 預載入所有頭像
 * @returns {Promise<void>}
 */
export function preloadAvatars() {
    return Promise.allSettled(
        avatarUrls.map(
            (url) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                })
        )
    );
}

export default avatarUrls;
