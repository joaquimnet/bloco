import { FC } from 'react';

type Props = {
  images: string[];
  onImageClicked: (src: string) => void;
};

export const ImageList: FC<Props> = ({ images, onImageClicked }) => {
  if (!images.length) {
    return null;
  }

  return (
    <>
      {images.map((img, i) => (
        <span key={`img-${i}-${img.length}`}>
          <img
            src={img}
            onContextMenu={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              onImageClicked(img);
            }}
          />
        </span>
      ))}
    </>
  );
};
