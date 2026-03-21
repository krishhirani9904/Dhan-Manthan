// // src/components/common/ItemImage.jsx
// function ItemImage({ image, alt = '', className = 'text-6xl', imgClassName = 'w-16 h-16 object-contain' }) {
//   // Real image = imported path (starts with / or data: or http)
//   // Emoji = short unicode string
//   const isRealImage = image && (
//     image.startsWith('/') || 
//     image.startsWith('data:') || 
//     image.startsWith('http') ||
//     image.length > 10
//   );

//   if (isRealImage) {
//     return <img src={image} alt={alt} className={imgClassName} />;
//   }

//   return <span className={className}>{image}</span>;
// }

// export default ItemImage;
// src/components/common/ItemImage.jsx
function ItemImage({ image, alt = '', className = '' }) {
  const isRealImage = image && (
    image.startsWith('/') ||
    image.startsWith('data:') ||
    image.startsWith('http') ||
    image.length > 10
  );

  if (isRealImage) {
    return (
      <img
        src={image}
        alt={alt}
        className={`w-full h-full object-contain p-2 ${className}`}
      />
    );
  }

  return <span className={`${className}`}>{image}</span>;
}

export default ItemImage;