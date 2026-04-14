// ==================== WHATSAPP CONFIGURATION ====================
let WHATSAPP_NUMBER = '201009447671'; // القيمة الافتراضية

// دالة لتحديث رقم الواتساب
window.updateWhatsAppConfig = function(number) {
    WHATSAPP_NUMBER = number;
};

// تعديل في دالة إرسال الطلب لاستخدام الرقم الديناميكي
// في السطر 205 تقريباً، استبدل:
// const whatsappNumber = '201009447671';
// بـ:
const whatsappNumber = WHATSAPP_NUMBER;

// ==================== REINITIALIZE EVENT LISTENERS ====================
window.reinitializeEventListeners = function() {
    // إعادة تفعيل أزرار "أضف للطلب"
    const addToOrderBtns = document.querySelectorAll('.btn-add-to-order');
    addToOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            
            if (selectedItemsSet.has(itemName)) {
                selectedItemsSet.delete(itemName);
                this.innerHTML = '<i class="fas fa-plus"></i> أضف للطلب';
                this.style.background = 'var(--light-color)';
                this.style.color = 'var(--primary-color)';
            } else {
                selectedItemsSet.add(itemName);
                this.innerHTML = '<i class="fas fa-check"></i> تم الإضافة';
                this.style.background = 'var(--primary-color)';
                this.style.color = '#fff';
            }
            
            updateSelectedItems();
            document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // إعادة تفعيل فلاتر المنيو
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // إعادة تفعيل checkboxes في نموذج الطلب
    const checkboxes = document.querySelectorAll('input[name="items"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedItemsSet.add(this.value);
            } else {
                selectedItemsSet.delete(this.value);
            }
            updateSelectedItems();
        });
    });
};

// ==================== NAVIGATION ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Close menu when clicking on nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// ==================== MENU FILTERING ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        menuItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category.includes(filter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ==================== ADD TO ORDER ====================
const addToOrderBtns = document.querySelectorAll('.btn-add-to-order');
const selectedItemsSet = new Set();

function updateSelectedItems() {
    const display = document.getElementById('selectedItemsDisplay');
    
    if (selectedItemsSet.size === 0) {
        display.innerHTML = '<p class="no-items">لم تختر أصناف بعد</p>';
    } else {
        display.innerHTML = Array.from(selectedItemsSet)
            .map(item => `<span class="item-tag">${item}</span>`)
            .join('');
    }
}

addToOrderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const itemName = btn.getAttribute('data-item');
        
        if (selectedItemsSet.has(itemName)) {
            selectedItemsSet.delete(itemName);
            btn.innerHTML = '<i class="fas fa-plus"></i> أضف للطلب';
            btn.style.background = 'var(--light-color)';
            btn.style.color = 'var(--primary-color)';
        } else {
            selectedItemsSet.add(itemName);
            btn.innerHTML = '<i class="fas fa-check"></i> تم الإضافة';
            btn.style.background = 'var(--primary-color)';
            btn.style.color = '#fff';
        }
        
        updateSelectedItems();
        
        // Scroll to order section
        document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
    });
});

// ==================== ORDER FORM ====================
const orderForm = document.getElementById('orderForm');
const checkboxes = document.querySelectorAll('input[name="items"]');

// Sync checkboxes with selected items
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            selectedItemsSet.add(checkbox.value);
        } else {
            selectedItemsSet.delete(checkbox.value);
        }
        updateSelectedItems();
    });
});

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();
    
    // Get selected items from checkboxes
    const selectedItems = Array.from(document.querySelectorAll('input[name="items"]:checked'))
        .map(cb => cb.value);

    // Validation
    if (!name || !phone || !address) {
        alert('⚠️ من فضلك املأ جميع البيانات المطلوبة');
        return;
    }

    if (selectedItems.length === 0 && selectedItemsSet.size === 0) {
        alert('⚠️ من فضلك اختر صنف واحد على الأقل');
        return;
    }

    // Validate phone number
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
        alert('⚠️ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 01 ويتكون من 11 رقم');
        return;
    }

    // Combine selected items
    const allItems = [...new Set([...selectedItems, ...selectedItemsSet])];

    // Create WhatsApp message
    let message = `*🔥 طلب جديد من مشويات ابن البلد*\n\n`;
    message += `*👤 الاسم:* ${name}\n`;
    message += `*📱 الهاتف:* ${phone}\n`;
    message += `*📍 العنوان:* ${address}\n\n`;
    message += `*🍽️ الطلب:*\n`;
    allItems.forEach((item, index) => {
        message += `${index + 1}. ${item}\n`;
    });
    
    if (notes) {
        message += `\n*📝 ملاحظات:*\n${notes}`;
    }

    message += `\n\n_تم إرسال الطلب من الموقع الإلكتروني_`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '201090408853';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    alert('✅ تم إرسال طلبك! سيتم التواصل معك قريباً عبر واتساب');

    // Reset form
    orderForm.reset();
    selectedItemsSet.clear();
    updateSelectedItems();
    
    // Reset add to order buttons
    addToOrderBtns.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-plus"></i> أضف للطلب';
        btn.style.background = 'var(--light-color)';
        btn.style.color = 'var(--primary-color)';
    });
});

// ==================== SCROLL TO TOP ====================
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== RATING BARS ANIMATION ====================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const ratingBarsSection = document.querySelector('.rating-bars');
if (ratingBarsSection) {
    observer.observe(ratingBarsSection);
}

// ==================== CONSOLE MESSAGE ====================
console.log('%c🔥 مشويات ابن البلد', 'color: #d4350e; font-size: 24px; font-weight: bold;');
console.log('%cموقع إلكتروني احترافي - تم التطوير بأعلى معايير الجودة', 'color: #666; font-size: 14px;');
