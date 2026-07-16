import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images?.length) return null;

  return (
    <section className="py-4">
      <div className="w-full px-5 md:px-10 xl:px-16">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={12}
          slidesPerView={1}
          className="rounded-xl shadow"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Hotel ${index + 1}`}
                className="h-[220px] w-full rounded-xl object-cover md:h-[350px] xl:h-[400px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ImageGallery;