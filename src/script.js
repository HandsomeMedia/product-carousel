class CustomSlider extends HTMLElement {
  constructor() {
    super();

    const style = document.createElement("style");
    style.textContent = `
      :host {
        contain: size layout;
        line-height: 1.2;
        display: block;
        height: 100%;
        --border-radius: 5px;
        --accent-color: ${this.getAttribute("accent-color")};
        --sprite-bg: url(https://d3jlxzdxc80cmp.cloudfront.net/adt/hiring/exercise2/sprite.png) 0 0 / 800px 1800px;
      }

      :host([focus-outline="true"]) button:focus, 
      :host([focus-outline="true"]) a:focus{
        box-shadow: inset 0 0 0 4px var(--accent-color); 
      }

      button{
        cursor: pointer;
        border: none;
      }
      
      button:focus, a:focus{
        outline: none;
      }

      a,
      a:visited {
        font-size: 14px;
        color: #0066c0;
        text-decoration: none;
      }

      a:hover {
        color: #c45500;
        text-decoration: underline;
      }

      .slider {
        position: relative;
        box-sizing: border-box;
        display: flex;
        max-width: 100vw;
        height: calc(100% - 12px);
        padding: 12px 6px 0;
        scroll-padding: 12px;
        overflow-x: scroll;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
      }

      .slider::-webkit-scrollbar {
        width: 0;
        height: 0;
      }

      .slider::after{
        content: "";
        flex: 0 0 6px;
      }

      .card{
        position: relative;
        flex: 0 0 calc(25% - 12px);
        margin: 0 6px;
        border-radius: var(--border-radius);
        scroll-snap-align: start;
        background: white;
        box-shadow: 0 0 6px -3px black;
      }

      .card::after{
        content: "";
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 8px;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        background: var(--accent-color);
      }

      .card[data-expanded="true"] .panel{
        transform: translateY(0);
      }

      .card[data-expanded="true"] .title{
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
      }

      .card[data-expanded="true"] .details {
        transform: translateY(calc(var(--slider-offset) - 50% - 40px));
      }

      .product-img-link{
        box-sizing: border-box;
        display: inline-block;
        height: 100%;
        padding: 24px 24px 72px;
        border-radius: var(--border-radius);
      }
      
      .product-img-link img{
        display: block;
        opacity: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center 20%;
        animation: fade-in 1s var(--delay) forwards;
      }

      .panel{
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 2px;
        width: calc(100% - 4px);
        height: 100%;
        text-align: center;
        border-top: 1px solid lightgray;
        border-radius: var(--border-radius);
        padding: 0 24px;
        transform: translateY(70%);
        background: linear-gradient(rgba(235,235,235,.7), rgba(255,255,255,.9));
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        transition: transform .25s ease-out;
      }

      .expand-btn{
        width: 28px;
        height: 30px;
        padding: 0 12px;
        box-sizing: content-box;
        border-radius: var(--border-radius);
        background: var(--sprite-bg);
        background-position: -110px -2px;
        background-clip: content-box;
      }

      .details {
        transition: transform .2s .05s ease-out;
      }

      .header > *{
        color: black;
        margin: 0 0 5px;
      }

      .header:hover {
        text-decoration: none;
      }

      .title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 16px;
        font-weight: normal;
      }

      .price{
        font-size: 20px;
        font-weight: bold;
      }

      .prime[data-eligible="true"] {
        display: inline-block;        
        background: var(--sprite-bg);
        background-position: -270px -3100px;
        width: 90px;
        height: 24px;
        transform: scale(.875);
      }

      .rating{
        position: relative;
        width: 120px;
        height: 22px;
        margin: 24px auto 0;
        background: var(--sprite-bg);
        background-position: -320px -2980px;
        text-align: left;
      }
      
      .rating::before{
        content: "";
        position: absolute;
        width: var(--rating-percent);
        height: 100%;
        background: inherit;
        background-position: -200px -2980px;
      }

      .controls {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        pointer-events: none;
        z-index: 1;
      }

      .next-btn, .prev-btn{
        width: 40px;
        height: 58px;
        border: 1px solid lightgray;
        background: var(--sprite-bg);
        background-color: rgba(235,235,235,.7);
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        pointer-events: all;
        transition: transform .3s ease-out;
      }

      .next-btn{
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        background-position: -200px 0px;
        margin-right: -2px;
        transform: translateX(100%);
      }

      .prev-btn{
        margin-left: -2px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        background-position: -240px 0px;
        transform: translateX(-100%);
      }

      .indicators {
        position: absolute;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: center;
        pointer-events: all;
      }

      .indicator {
        width: 8px;
        height: 8px;
        padding: 12px 2px;
        border-radius: 50%;
        background-color: gray;
        background-clip: content-box;
        transition: background-color .3s;
        cursor: pointer;
      }

      .indicator[data-active="true"]{
        background-color: var(--accent-color);
      }

      @media (max-width: 768px){
        .card{
          flex-basis: calc(33.3333% - 12px);
        }
      }

      @media (max-width: 640px){
        .card{
          flex-basis: calc(50% - 12px);
        }
      }

      @media (max-width: 480px){
        .card{
          flex-basis: calc(100% - 12px);
        }
      }

      @media (hover: hover) {
        :host(:hover) .prev-btn,
        :host(:hover) .next-btn,
        :host([focus-outline="true"]) .prev-btn, 
        :host([focus-outline="true"]) .next-btn{
          transform: translateX(0);
        }
      }

      @keyframes fade-in {
        to {
          opacity: 1;
        }
      }
    `;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
  }

  async connectedCallback() {
    const json = await fetch(this.getAttribute("src")).then(data =>
      data.json()
    );

    this.initCards(json.asins);
    this.initControls();
    this.initIndicators();
  }

  initCards(items) {
    let card, img;
    this.slider = document.createElement("div");
    this.slider.className = "slider";

    items.forEach((item, i) => {
      card = document.createElement("article");
      card.className = "card";
      card.style.setProperty("--delay", i * 100 + "ms");
      card.addEventListener("click", this.handleCardClick);
      card.innerHTML = `
        <a class="product-img-link" href="//amazon.com${item.detailPageUrl}" target="_blank"></a>
        <div class="panel">
          <button class="expand-btn" aria-expanded="false" title="Expand details"></button>
          <div class="details">
            <a class="header" href="//amazon.com${item.detailPageUrl}" target="_blank" tabindex="-1">
              <h2 class="title">${item.title}</h2>
              <p class="price">${item.price}</p>
            </a>
            <i class="prime" data-eligible=${item.isPrimeEligible}></i>
            <div class="rating" style="--rating-percent: ${item.ratingExact / 5 * 100}%"></div>
            <a href="//amazon.com${item.reviewLink}" target="_blank" tabindex="-1">See all reviews</a>
          </div>
        </div>
      `;

      img = document.createElement("img");
      img.parent = card.querySelector(".product-img-link");
      img.onload = e => e.target.parent.appendChild(e.target);
      img.src = item.imageMedium;
      this.slider.appendChild(card);
    });

    this.shadowRoot.appendChild(this.slider);
    this.slider.style.setProperty("--slider-offset", this.slider.offsetHeight / 2 + "px");
  }

  initControls() {
    this.nav = document.createElement("nav");
    this.nav.className = "controls";
    this.nav.innerHTML = `
      <button class="prev-btn" data-vector="-1"></button>
      <button class="next-btn" data-vector="1"></button>
    `;
    this.nav.addEventListener("click", this.updateScroll.bind(this));
    this.shadowRoot.appendChild(this.nav);
  }

  initIndicators() {
    if (this.getAttribute("indicators") === "false") return;

    const indicators = document.createElement("div");
    const cards = Array.from(this.slider.children);
    const observer = new IntersectionObserver(
      this.handleIntersection,
      {
        root: this.slider,
        threshold: 0.5
      }
    );
    let indicator;

    cards.forEach((card, i) => {
      card.indicator = document.createElement("i");
      card.indicator.className = "indicator";
      card.indicator.dataset.index = i;
      indicators.appendChild(card.indicator);
      observer.observe(card);
    });

    indicators.className = "indicators";
    this.nav.style.setProperty("padding-bottom", "32px");
    this.nav.appendChild(indicators);
  }

  handleCardClick(e) {
    if (e.target.classList.contains("expand-btn")) {
      this.dataset.expanded = this.dataset.expanded !== "true";
      e.target.setAttribute("aria-expanded", this.dataset.expanded);
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      entry.target.indicator.dataset.active = entry.intersectionRatio > 0.5;
    });
  }

  updateScroll(e) {
    const cardWidth = Math.floor(
      this.slider.scrollWidth / this.slider.childElementCount
    );
    let index;

    if (e.target.dataset.vector) {
      index = Math.round(
        this.slider.scrollLeft / cardWidth + parseInt(e.target.dataset.vector)
      );
    } else {
      index = parseInt(e.target.dataset.index);
    }

    this.slider.scrollTo({
      left: cardWidth * index,
      behavior: "smooth"
    });
  }
}

customElements.define("custom-slider", CustomSlider);
