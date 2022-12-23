import Image from 'next/image'

export const CustomImage = (props: { imageUrl: string, className?: string, alt?: string,width?:number,height?:number }) => {
    return (
        <div>
            <Image src={props.imageUrl}
                className={props.className}
                alt={!props.alt?'':props.alt}
                width={!props.width?700:props.width}
                height={!props.height?475:props.height}
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
