const ShopLoading = () => (
  <section id={`top`} className={`bb-shop-loading`} aria-labelledby={`bb-shop-loading-heading`} aria-busy={`true`}>
    <div id={`bb-shop-loading-container`} className={`bb-container`}>
      <span id={`bb-shop-loading-eyebrow`} className={`bb-eyebrow`}>The Misty Market</span>
      <h1 id={`bb-shop-loading-heading`} className={`bb-shop-loading-heading`}>A little luxury awaits.</h1>
      <p id={`bb-shop-loading-status`} className={`bb-shop-loading-status`} role={`status`}>Loading the Collection</p>
      <div id={`bb-shop-loading-grid`} className={`bb-shop-loading-grid`} aria-hidden={`true`}>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} id={`bb-shop-loading-card-${index}`} className={`bb-shop-loading-card`}>
            <div id={`bb-shop-loading-visual-${index}`} className={`bb-shop-loading-visual`} />
            <div id={`bb-shop-loading-title-${index}`} className={`bb-shop-loading-line bb-shop-loading-title`} />
            <div id={`bb-shop-loading-description-${index}`} className={`bb-shop-loading-line bb-shop-loading-description`} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopLoading;
