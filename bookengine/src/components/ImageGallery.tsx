import { Image as ImageIcon } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images?.length) return null;

  const total = images.length;

  return (
    <section className="py-6">
      <div className="w-full px-5 md:px-10 xl:px-16">

        {/* Mobile */}
        <div className="md:hidden">
          <img
            src={images[0]}
            alt=""
            className="w-full h-72 rounded-2xl object-cover"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">

          {/* 1 IMAGE */}
          {total === 1 && (
            <img
              src={images[0]}
              alt=""
              className="w-full h-[520px] rounded-2xl object-cover"
            />
          )}

          {/* 2 IMAGES */}
          {total === 2 && (
            <div className="grid grid-cols-2 gap-2 h-[520px]">
              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  className="w-full h-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          {/* 3 IMAGES */}
          {total === 3 && (
            <div className="grid grid-cols-12 gap-2 h-[520px]">

              <div className="col-span-7">
                <img
                  src={images[0]}
                  className="w-full h-full rounded-l-2xl object-cover"
                />
              </div>

              <div className="col-span-5 grid grid-rows-2 gap-2">
                {images.slice(1).map((img) => (
                  <img
                    key={img}
                    src={img}
                    className="w-full h-full rounded-r-2xl object-cover"
                  />
                ))}
              </div>

            </div>
          )}

          {/* 4 IMAGES */}
          {total === 4 && (
            <div className="grid grid-cols-2 gap-2 h-[520px]">

              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  className="w-full h-full rounded-2xl object-cover"
                />
              ))}

            </div>
          )}

          {/* 5 OR MORE */}
          {total >= 5 && (
            <div className="grid grid-cols-12 gap-2 h-[520px]">

              <div className="col-span-7">
                <img
                  src={images[0]}
                  className="w-full h-full rounded-l-2xl object-cover"
                />
              </div>

              <div className="col-span-5 grid grid-cols-2 gap-2">

                {images.slice(1, 5).map((img, index) => {
                  const isLast = index === 3;
                  const remaining = total - 5;

                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden"
                    >
                      <img
                        src={img}
                        className={`w-full h-full object-cover ${
                          index === 1
                            ? "rounded-tr-2xl"
                            : index === 3
                            ? "rounded-br-2xl"
                            : ""
                        }`}
                      />

                      {isLast && remaining > 0 && (
                        <div className="absolute inset-0 bg-black/55 flex flex-col justify-center items-center text-white">

                          <ImageIcon size={32} />

                          <h2 className="text-3xl font-bold mt-2">
                            +{remaining}
                          </h2>

                          <p className="text-sm">
                            View More
                          </p>

                        </div>
                      )}
                    </div>
                  );
                })}

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default ImageGallery;