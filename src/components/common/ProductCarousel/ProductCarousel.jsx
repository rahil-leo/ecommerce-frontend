import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from './ProductCarousel.module.css';
import Card from '../Card/Card';
import { ROUTES } from '@constants';

const ProductCarousel = ({ products = [], title = '', description = '' }) => {
  if (!products || products.length === 0) {
    return null;
  }

  // Disable loop if there are fewer products than slidesPerView
  const shouldLoop = products.length > 5;

  return (
    <section className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination, Scrollbar]}
        slidesPerView={1}
        spaceBetween={16}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={shouldLoop}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          480: {
            slidesPerView: Math.min(2, products.length),
          },
          768: {
            slidesPerView: Math.min(3, products.length),
          },
          1024: {
            slidesPerView: Math.min(4, products.length),
          },
          1280: {
            slidesPerView: Math.min(5, products.length),
          },
        }}
        className={styles.swiper}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className={styles.slide}>
            <Card padding="none" hover className={styles.productCard}>
              <Link to={`${ROUTES.PRODUCTS}/${product._id}`} className={styles.productLink}>
                <div className={styles.imageWrapper}>
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productCategory}>
                    {product.category?.name || 'Uncategorized'}
                  </p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>${product.price}</span>
                    <div className={styles.productRating}>
                      ⭐ {product.rating || 0} ({product.numReviews || 0})
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperButtonPrev}></div>
      <div className={styles.swiperButtonNext}></div>
    </section>
  );
};

export default ProductCarousel;

