import { useRouter } from "next/router";

const FloatBtnLayout = ({ children }: React.PropsWithChildren<{}>) => {
    const router = useRouter();
    return (
        <div>
            <div className="fixed  top-20 animated z-50 w-full p-3">
                <button
                    className="  py-2 px-4 mt-5 bg-red-300 rounded-lg text-white font-semibold hover:bg-red-600"
                    onClick={() => {
                        if (router.query['backUrl']) {
                            router.push(router.query['backUrl']?.toString()!)
                        } else {
                            router.push({
                                pathname: '/',
                            })
                        }
                    }}
                >
                    回上一頁
                </button>
            </div>
            {children}
        </div>

    );
}

export default FloatBtnLayout;