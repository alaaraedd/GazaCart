document.addEventListener("DOMContentLoaded", () => {
    // زر "عرض الكل"
    document.querySelectorAll('.view-all').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const track = document.getElementById(this.getAttribute('data-target'));
            if (track) {
                const scrollWidth = track.scrollWidth;
                const clientWidth = track.clientWidth;
                const maxScroll = scrollWidth - clientWidth;
                
                if (Math.abs(track.scrollLeft) < 5 || track.scrollLeft >= 0) {
                    track.scrollTo({ left: -maxScroll, behavior: 'smooth' });
                } else {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                }
            }
        });
    });

    // زر تسجيل في الـ Hero
    const heroBtn = document.querySelector(".hero .btn.yellow");
    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            const authModal = document.getElementById("authModal");
            if (authModal) authModal.style.display = "flex";
        });
    }

    // زر إغلاق المودال
    const modalClose = document.querySelector(".modal .close");
    if (modalClose) {
        modalClose.addEventListener("click", () => {
            const authModal = document.getElementById("authModal");
            if (authModal) authModal.style.display = "none";
        });
    }

    // التبديل بين تسجيل / تسجيل دخول
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const tabContent = document.getElementById(btn.dataset.tab);
            if (tabContent) tabContent.classList.add("active");
        });
    });

    // زر "تأكيد" بالكارت
    document.querySelectorAll(".cart-summary .btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const cartModal = document.getElementById("cartModal");
            const paymentModal = document.getElementById("paymentModal");
            if (cartModal) cartModal.style.display = "none";
            if (paymentModal) paymentModal.style.display = "flex";
        });
    });

    // زر "دفع كاش"
    const btnCash = document.querySelector(".btn-cash");
    if (btnCash) {
        btnCash.addEventListener("click", () => {
            const paymentModal = document.getElementById("paymentModal");
            const checkoutModal = document.getElementById("checkoutModal");
            if (paymentModal) paymentModal.style.display = "none";
            if (checkoutModal) checkoutModal.style.display = "flex";
        });
    }

    // زر تأكيد checkout يفتح doneModal
    const checkoutForm = document.querySelector(".checkout-popup form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const checkoutModal = document.getElementById("checkoutModal");
            const doneModal = document.getElementById("doneModal");
            if (checkoutModal) checkoutModal.style.display = "none";
            if (doneModal) doneModal.style.display = "flex";
        });
    }

    // زر أكمل التسوق
    const btnDone = document.querySelector(".btn-done");
    if (btnDone) {
        btnDone.addEventListener("click", () => {
            const doneModal = document.getElementById("doneModal");
            if (doneModal) doneModal.style.display = "none";
        });
    }

    // القوائم المنسدلة
    const dropdownBtn = document.querySelector('.dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", () => {
            dropdownMenu.classList.toggle('show');
            dropdownBtn.classList.toggle('open');
        });
    }

    // فتح بوب اب
    window.openPopup = function(id) {
        const popup = document.getElementById(id);
        if (popup) popup.style.display = "flex";
    }

    window.closePopup = function(id) {
        const popup = document.getElementById(id);
        if (popup) popup.style.display = "none";
    }

    // فتح/إغلاق المودالات عند الضغط خارجها
    window.addEventListener("click", e => {
        // authModal
        const authModal = document.getElementById("authModal");
        if (authModal && e.target === authModal) authModal.style.display = "none";

        // cartModal
        const cartModal = document.getElementById('cartModal');
        if (cartModal && e.target === cartModal) cartModal.style.display = "none";

        // popups
        document.querySelectorAll(".popup-overlay").forEach(p => {
            if (e.target === p) p.style.display = "none";
        });

        // dropdown
        if (!e.target.closest('.dropdown-container')) {
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            if (dropdownBtn) dropdownBtn.classList.remove('open');
        }
        
    });
});
function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  menu.classList.toggle("active");
}
// افتح الكارت من الهيدر (يمكن استدعاؤه من HTML)
window.openCart = function () {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.style.display = 'flex';
}
