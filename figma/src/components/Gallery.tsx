import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from "./ui/button";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjBzdW5zZXR8ZW58MXx8fHwxNzYwMjU2NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Hồ bơi vô cực",
    size: "large"
  },
  {
    url: "https://images.unsplash.com/photo-1520056107387-2cb5354436ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRlbHV4ZSUyMHJvb20lMjBiYWxjb255fGVufDF8fHx8MTc1OTIwMTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Phòng Deluxe",
    size: "medium"
  },
  {
    url: "https://images.unsplash.com/photo-1641150557653-e4c409426e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzYwMjU2NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Bãi biển riêng",
    size: "medium"
  },
  {
    url: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU5MjAwODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Junior Suite",
    size: "small"
  },
  {
    url: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Family Suite",
    size: "small"
  }
];

export function Gallery() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-wider">Thư viện ảnh</span>
          <h2 className="text-3xl md:text-4xl mt-2 mb-4">
            Khám phá NgocHiepHotel
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chiêm ngưỡng vẻ đẹp và sự sang trọng của khách sạn qua bộ sưu tập hình ảnh
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Large image - spans 2 columns and 2 rows */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <ImageWithFallback
              src={galleryImages[0].url}
              alt={galleryImages[0].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl">{galleryImages[0].title}</h3>
              </div>
            </div>
          </div>

          {/* Medium images */}
          {galleryImages.slice(1, 3).map((image, index) => (
            <div key={index} className="md:col-span-2 relative group overflow-hidden rounded-lg shadow-lg cursor-pointer h-64">
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}

          {/* Small images */}
          {galleryImages.slice(3, 5).map((image, index) => (
            <div key={index} className="md:col-span-2 relative group overflow-hidden rounded-lg shadow-lg cursor-pointer h-64">
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Xem thêm hình ảnh
          </Button>
        </div>
      </div>
    </section>
  );
}
