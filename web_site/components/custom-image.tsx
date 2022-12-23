import Image from 'next/image'

export const CustomImage = (props: { imageUrl: string, className?: string, alt?: string }) => {
    return (
        <div>
            <Image src={props.imageUrl}
                className={props.className}
                alt={props.alt!}
                width={700}
                height={475}
                sizes="100vw"
                style={{
                    width: '100%',
                    height: 'auto',
                }}
                placeholder="blur"
                blurDataURL="./blur.jpg"
            ></Image>
        </div>
    );
}
