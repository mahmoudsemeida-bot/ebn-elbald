/**
 * Data Loader Script
 * يقوم بتحميل البيانات من ملف JSON وعرضها ديناميكياً
 */

let restaurantData = null;

// تحميل البيانات من ملف JSON
async function loadData() {
    try {
        const response = await fetch('data/restaurant-data.json');
        if (!response.ok) {
            throw new Error('فشل في تحميل البيانات');
        }
        restaurantData = await response.json();
        
        // بعد تحميل البيانات، نقوم بتحديث الصفحة
        updatePageContent();
        renderMenu();
        renderReviews();
        updateContactInfo();
        
        return restaurantData;
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        // في حالة الفشل، يمكن استخدام بيانات احتياطية
        return null;
    }
}

// تحديث محتوى الصفحة
function updatePageContent() {
    if (!restaurantData) return;

    const info = restaurantData.restaurantInfo;

    // تحديث التقييم في الهيرو
    document.querySelector('.rating-number').textContent = info.rating;
    document.querySelector('.rating-text').textContent = `(${info.totalReviews}+ تقييم)`;

    // تحديث سنوات الخبرة
    const experienceBadge = document.querySelector('.experience-badge');
    if (experienceBadge) {
        experienceBadge.querySelector('.badge-number').textContent = `${info.yearsOfExperience}+`;
    }

    // تحديث معلومات التواصل
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = `tel:${info.contact.phone}`;
        link.textContent = info.contact.phone;
    });

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
        link.href = `https://wa.me/${info.contact.whatsapp}`;
    });
}

// عرض المنيو ديناميكياً
function renderMenu() {
    if (!restaurantData) return;

    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    restaurantData.menu.items.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// إنشاء عنصر منيو
function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-category', item.category.join(' '));

    // تحديد نوع البادج
    let badgeHTML = '';
    if (item.badge) {
        let badgeClass = 'menu-badge';
        if (item.badgeType === 'best') badgeClass += ' best';
        if (item.badgeType === 'special') badgeClass += ' special';
        badgeHTML = `<div class="${badgeClass}">${item.badge}</div>`;
    }

    div.innerHTML = `
        <div class="menu-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            ${badgeHTML}
        </div>
        <div class="menu-content">
            <div class="menu-header">
                <h3>${item.name}</h3>
                <div class="item-rating">
                    <i class="fas fa-star"></i>
                    <span>${item.rating}</span>
                </div>
            </div>
            <p class="menu-description">${item.description}</p>
            <button class="btn-add-to-order" data-item="${item.name}">
                <i class="fas fa-plus"></i>
                أضف للطلب
            </button>
        </div>
    `;

    return div;
}

// عرض التقييمات ديناميكياً
function renderReviews() {
    if (!restaurantData) return;

    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;

    reviewsGrid.innerHTML = '';

    restaurantData.reviews.items.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsGrid.appendChild(reviewCard);
    });

    // تحديث التقييم العام
    updateOverallRating();
}

// إنشاء كارت تقييم
function createReviewCard(review) {
    const div = document.createElement('div');
    div.className = 'review-card';

    // إنشاء النجوم
    const fullStars = Math.floor(review.rating);
    const hasHalfStar = review.rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    div.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <h4>${review.customerName}</h4>
                    <span class="review-date">${review.date}</span>
                </div>
            </div>
            <div class="review-stars">
                ${starsHTML}
            </div>
        </div>
        <p class="review-text">${review.comment}</p>
        <div class="review-footer">
            ${review.verified ? '<span class="verified"><i class="fas fa-check-circle"></i> عميل معتمد</span>' : ''}
        </div>
    `;

    return div;
}

// تحديث التقييم العام
function updateOverallRating() {
    if (!restaurantData) return;

    const overall = restaurantData.reviews.overall;

    // تحديث الرقم
    document.querySelector('.score-number').textContent = overall.rating;
    document.querySelector('.rating-count').textContent = `بناءً على ${overall.totalReviews}+ تقييم`;

    // تحديث البارات
    Object.keys(overall.distribution).forEach(stars => {
        const percentage = overall.distribution[stars];
        const bar = document.querySelector(`.rating-bar-item:nth-child(${6 - stars}) .bar-fill`);
        if (bar) {
            bar.style.width = `${percentage}%`;
        }
    });
}

// تحديث معلومات التواصل
function updateContactInfo() {
    if (!restaurantData) return;

    const contact = restaurantData.restaurantInfo.contact;

    // تحديث العنوان
    document.querySelectorAll('.contact-text p').forEach((p, index) => {
        if (p.textContent.includes('طامية')) {
            p.innerHTML = `${contact.address}`;
        }
    });
}

// تحديث فلاتر المنيو من JSON
function renderMenuFilters() {
    if (!restaurantData) return;

    const filtersContainer = document.querySelector('.menu-filters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = '';

    restaurantData.menu.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn' + (category.id === 'all' ? ' active' : '');
        button.setAttribute('data-filter', category.nameEn);
        button.textContent = category.name;
        filtersContainer.appendChild(button);
    });
}

// تصدير البيانات للاستخدام في ملفات أخرى
function getRestaurantData() {
    return restaurantData;
}

// تحديث checkboxes في نموذج الطلب
function updateOrderFormItems() {
    if (!restaurantData) return;

    const menuSelectGrid = document.querySelector('.menu-select-grid');
    if (!menuSelectGrid) return;

    menuSelectGrid.innerHTML = '';

    restaurantData.menu.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'menu-select-item';

        // تحديد الأيقونة حسب الفئة
        let icon = 'fas fa-drumstick-bite';
        if (item.category.includes('sandwiches')) {
            icon = 'fas fa-hamburger';
        } else if (item.category.includes('mandi')) {
            icon = 'fas fa-utensils';
        } else if (item.category.includes('specials')) {
            icon = 'fas fa-fire';
        }

        div.innerHTML = `
            <input type="checkbox" id="item${item.id}" name="items" value="${item.name}">
            <label for="item${item.id}">
                <i class="${icon}"></i>
                <span>${item.name}</span>
            </label>
        `;

        menuSelectGrid.appendChild(div);
    });
}

// دالة لتحديث رقم الواتساب في النموذج
function updateWhatsAppNumber() {
    if (!restaurantData) return;
    
    const whatsappNumber = restaurantData.restaurantInfo.contact.whatsapp;
    
    // تحديث في ملف main.js (سيتم استخدامه)
    if (window.updateWhatsAppConfig) {
        window.updateWhatsAppConfig(whatsappNumber);
    }
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderMenuFilters();
    updateOrderFormItems();
    updateWhatsAppNumber();
    
    // إعادة تفعيل event listeners بعد تحميل البيانات
    if (window.reinitializeEventListeners) {
        window.reinitializeEventListeners();
    }
});

// تصدير الدوال للاستخدام الخارجي
window.restaurantDataLoader = {
    loadData,
    getRestaurantData,
    renderMenu,
    renderReviews
};
