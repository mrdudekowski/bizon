import { getImageProps } from "next/image";

type ShopResponsiveImageProps = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ShopResponsiveImage({
  desktopSrc,
  mobileSrc,
  alt,
  className,
  priority = false,
  sizes = "100vw",
}: ShopResponsiveImageProps) {
  const common = {
    alt,
    sizes,
    quality: 82,
    ...(priority
      ? { fetchPriority: "high" as const }
      : { loading: "lazy" as const }),
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: desktopSrc,
    width: 1672,
    height: 941,
  });
  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({
    ...common,
    src: mobileSrc,
    width: 1122,
    height: 1402,
  });

  return (
    <picture className={className}>
      <source media="(min-width: 640px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 639px)" srcSet={mobileSrcSet} />
      <img {...mobileProps} alt={alt} />
    </picture>
  );
}
