export const addToFavorite = async (itemData: any) => {
    const req = await fetch("/api/favorite/add", {
        method: "POST",
        body: JSON.stringify(itemData),
        headers: { "content-type": "application/json" },
    });
    if (req.status === 200) {
        alert(`已新增『${itemData.title}』至我的最愛`)

    } else {
        const message = (await req.json());
        alert(message['message'])
    }
}

export const removeFromFavorite = async (itemData: any) => {
    const req = await fetch("/api/favorite/remove", {
        method: "POST",
        body: JSON.stringify(itemData),
        headers: { "content-type": "application/json" },
    });
    if (req.status === 200) {
        alert(`已移除『${itemData.title}』`)

    } else {
        const message = (await req.json());
        alert(message['message'])
    }
}