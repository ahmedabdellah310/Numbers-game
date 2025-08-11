// توليد رقم عشوائي للعبة
const randomNumber = Math.floor(Math.random() * 100) + 1;

// الحصول على عناصر الصفحة
let randomNum = document.getElementById("RN");
let result = document.getElementById("result");
let cards = Array.from(document.querySelectorAll(".container .card"));
let bullets = document.getElementById("nums");
let slideCount = cards.length;
let currentSlide = 1;
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
// قفل بسيط لمنع تكرار الانتقال عند النقرات السريعة
let isClickLocked = false;
// أعلام لمنع تنفيذ النقر مرتين عند استخدام pointerdown ثم click
let nextSuppressClick = false;
let prevSuppressClick = false;

function nextSlide() {
    if (nextBtn.classList.contains("disabled") || isClickLocked) {
        return false;
    } else {
        isClickLocked = true;
        currentSlide++;
        checker();
        // فك القفل بعد فترة قصيرة (زمن أصغر لاستجابة أسرع)
        setTimeout(() => (isClickLocked = false), 120);
    }
}

function prevSlide() {
    if (prevBtn.classList.contains("disabled") || isClickLocked) {
        return false;
    } else {
        isClickLocked = true;
        currentSlide--;
        checker();
        // فك القفل بعد فترة قصيرة (زمن أصغر لاستجابة أسرع)
        setTimeout(() => (isClickLocked = false), 120);
    }
}

// تفعيل على pointerdown لسرعة أعلى، مع منع التكرار عند click
nextBtn.addEventListener('pointerdown', function(e){
    e.preventDefault();
    nextSuppressClick = true;
    nextSlide();
});
prevBtn.addEventListener('pointerdown', function(e){
    e.preventDefault();
    prevSuppressClick = true;
    prevSlide();
});

// احتياطيًا: في حال عدم دعم pointer events على بعض الأجهزة
// منع السلوك الافتراضي للرابط وضمان تنفيذ خطوة واحدة لكل نقرة
nextBtn.addEventListener('click', function(e) {
    if (nextSuppressClick) {
        e.preventDefault();
        nextSuppressClick = false;
        return;
    }
    e.preventDefault();
    nextSlide();
});
prevBtn.addEventListener('click', function(e) {
    if (prevSuppressClick) {
        e.preventDefault();
        prevSuppressClick = false;
        return;
    }
    e.preventDefault();
    prevSlide();
});

// دعم لوحة المفاتيح لسهولة الاستخدام
document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    }
});

for (let i = 0; i < slideCount; i++) {
    let lis = document.createElement("li");
    lis.setAttribute("data-index", i + 1);
    lis.appendChild(document.createTextNode(i + 1));
    bullets.appendChild(lis);
}

let sliderBullets = Array.from(document.querySelectorAll(".buttons ul li"));

// إضافة وظائف النقر على النقاط
for (let i = 0; i < sliderBullets.length; i++) {
    sliderBullets[i].addEventListener("click", () => {
        currentSlide = parseInt(sliderBullets[i].getAttribute("data-index"));
        checker();
    });
}

function playSlide6Sound() {
    const audio = document.getElementById('slide6Sound');
    if (!audio) return;
    
    // إعادة تعيين الصوت إلى البداية
    audio.pause();
    audio.currentTime = 0;
    
    // محاولة تشغيل الصوت مع معالجة الأخطاء
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('خطأ في تشغيل الصوت:', error);
            // إظهار رسالة للمستخدم إذا فشل تشغيل الصوت
            alert('تعذر تشغيل الصوت. يرجى التأكد من تفعيل الصوت في المتصفح.');
        });
    }
}

function checker() {
    handleUnactiveElements();

    // إظهار البطاقة الحالية
    cards[currentSlide - 1].classList.add("active-opacity");
    
    // تشغيل الصوت عند الوصول للشريحة السادسة
    if (currentSlide === 6) {
        playSlide6Sound();
    }

    // تفعيل النقطة الحالية
    if (bullets.children[currentSlide - 1]) {
        bullets.children[currentSlide - 1].classList.add("active");
    }

    // التحكم في أزرار التنقل
    if (currentSlide == 1 || currentSlide == slideCount) {
        // إخفاء زر السابق في الشريحة الأولى والأخيرة
        prevBtn.parentElement.style.display = 'none';
    } else {
        // إظهار زر السابق في الشرائح الوسطى
        prevBtn.parentElement.style.display = 'inline-block';
        prevBtn.classList.remove("disabled");
    }
    
    if (currentSlide == slideCount) {
        // إخفاء الأرقام وزر التالي في الشريحة الأخيرة
        nextBtn.parentElement.style.display = 'none';
        bullets.style.display = 'none';
    } else {
        // إظهار الأرقام وزر التالي في الشرائح الأخرى
        nextBtn.parentElement.style.display = 'inline-block';
        bullets.style.display = 'flex';
        nextBtn.classList.remove("disabled");
        nextBtn.classList.add("animation");
    }

    // إعادة تشغيل اللعبة تلقائياً بعد 3 ثوانِ من ظهور النتيجة
    if (currentSlide == slideCount) {
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
}

function handleUnactiveElements() {
    // إزالة التفعيل من جميع البطاقات
    cards.forEach((card) => {
        card.classList.remove("active-opacity");
    });

    // إزالة التفعيل من جميع النقاط
    Array.from(bullets.children).forEach((bullet) => {
        bullet.classList.remove("active");
        bullet.classList.remove("active-BG");
    });
}

checker();

// إضافة تأثيرات صوتية (اختيارية)
function playClickSound() {
    // يمكن إضافة صوت هنا إذا أردت
}

// تحسين تجربة المستخدم
// ملاحظة: مستمعو الأحداث أعلاه يقومون بالفعل بمعالجة النقرات
// لذا نضيف الصوت ضمن نفس نقرة الزر بدون تكرار المنطق
nextBtn.addEventListener('click', function(){ playClickSound(); });
prevBtn.addEventListener('click', function(){ playClickSound(); });

// تهيئة الصوت عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const slide6Sound = document.getElementById('slide6Sound');
    if (slide6Sound) {
        // ضبط مستوى الصوت (0.0 إلى 1.0)
        slide6Sound.volume = 1.0;
        
        // محاولة تشغيل وإيقاف الصوت عند التحميل لتفعيل الصوت في المتصفح
        const playPromise = slide6Sound.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // تم تشغيل الصوت بنجاح، نقوم بإيقافه
                slide6Sound.pause();
                slide6Sound.currentTime = 0;
            }).catch(error => {
                console.log('تحذير: تعذر تهيئة الصوت:', error);
            });
        }
    }
});

// حساب النتيجة السحرية
let magicResult = randomNumber / 2;

// عرض الرقم العشوائي في البطاقة المخصصة
randomNum.innerHTML = `<strong>${randomNumber}</strong>`;

// عرض النتيجة النهائية
let resultCard = document.getElementById("result");
let resultContent = `
    <h2>🎉 النتيجة</h2>
    <p>الرقم الذي حصلت عليه هو:</p>
    <div style="font-size: 4rem; font-weight: bold; color: #fff; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${magicResult}</div>
`;

resultCard.innerHTML = resultContent;
