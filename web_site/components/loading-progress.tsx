const LoadingProgress = () => {
    return (
        <div className="pt-10">
                    <div className="mb-1 text-base font-bold text-green-700">載入中......</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full animate-bounce"></div>
                    </div>
                </div>
    );
}

export default LoadingProgress;