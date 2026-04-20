document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Live Seating Status Logic ---
    const updateStatus = () => {
        const now = new Date();
        const hours = now.getHours();
        
        // Open times: 11 (11 AM) to 15 (3 PM) OR 19 (7 PM) to 23 (11 PM)
        const isOpen = (hours >= 11 && hours < 15) || (hours >= 19 && hours < 23);

        const mainIndicator = document.getElementById('main-status-indicator');
        const dotInner = document.getElementById('status-dot-inner');
        const mainText = document.getElementById('main-status-text');

        if (mainIndicator && dotInner && mainText) {
            if (isOpen) {
                mainText.textContent = "Open Now";
                dotInner.classList.replace('bg-red-500', 'bg-green-500');
                if(!dotInner.classList.contains('bg-green-500')) dotInner.classList.add('bg-green-500');
                dotInner.classList.add('animate-pulse');
            } else {
                mainText.textContent = "Currently Closed";
                dotInner.classList.replace('bg-green-500', 'bg-red-500');
                if(!dotInner.classList.contains('bg-red-500')) dotInner.classList.add('bg-red-500');
                dotInner.classList.remove('animate-pulse');
            }
        }
    };

    updateStatus();
    setInterval(updateStatus, 60000); // Check every minute


    // --- 2. Menu Logic ---
    const menuContainer = document.getElementById('menu-container');
    const categoryFilters = document.getElementById('category-filters');
    const searchInput = document.getElementById('menu-search');
    const noResults = document.getElementById('no-results');
    
    let menuData = [];
    let categories = [];
    let currentCategory = 'All';
    let searchQuery = '';

    const formatPrice = (price) => `₹${price}`;

    const createMenuItemCard = (item) => {
        const isSpecial = item.name === 'Sarthi Special Veg';
        const badge = isSpecial 
            ? `<div class="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-widest">★ Sarthi Signature</div>`
            : `<div class="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-widest">${item.category}</div>`;

        const cardClass = isSpecial 
            ? 'bg-gradient-to-br from-[#735c00] to-[#d4af37] p-3 rounded-2xl flex items-center gap-4 group hover:shadow-xl transition-all duration-300 border border-[#d4af37]/50 shadow-lg ring-2 ring-[#d4af37]/30'
            : 'bg-surface-container-lowest p-3 rounded-2xl flex items-center gap-4 group hover:bg-surface-container transition-colors duration-300 border border-outline-variant/10 shadow-sm';

        const nameClass = isSpecial 
            ? 'font-noto-serif text-lg font-bold text-white'
            : 'font-noto-serif text-lg font-bold';

        const priceClass = isSpecial 
            ? 'font-noto-serif text-xl font-bold text-white whitespace-nowrap pr-2'
            : 'font-noto-serif text-xl font-bold text-primary whitespace-nowrap pr-2';

        return `
            <div class="${cardClass}">
                <div class="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface-variant shadow-inner ${isSpecial ? 'ring-2 ring-white/40' : ''}">
                    <img src="./assets/${item.name}.jpg" onerror="this.onerror=null; this.src='./assets/default-dish.png';" alt="${item.name}" class="w-full h-full object-cover"/>
                </div>
                <div class="flex-grow">
                    <p class="${nameClass}">${item.name}</p>
                    ${badge}
                </div>
                <p class="${priceClass}">${formatPrice(item.price)}</p>
            </div>
        `;
    };

    const renderMenu = () => {
        if(!menuContainer) return;
        
        const filteredData = menuData.filter(item => {
            const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredData.length === 0) {
            menuContainer.innerHTML = '';
            if(noResults) noResults.classList.remove('hidden');
        } else {
            if(noResults) noResults.classList.add('hidden');
            // Always put Sarthi Special Veg first
            filteredData.sort((a, b) => {
                if (a.name === 'Sarthi Special Veg') return -1;
                if (b.name === 'Sarthi Special Veg') return 1;
                return 0;
            });
            menuContainer.innerHTML = filteredData.map(createMenuItemCard).join('');
        }
    };

    const setupFilters = () => {
        if(!categoryFilters) return;
        categoryFilters.innerHTML = ''; // Clear existing
        
        const displayCategories = ['All', ...categories];

        displayCategories.forEach(cat => {
            const btn = document.createElement('button');
            const isActive = cat === currentCategory;
            
            // Base classes
            btn.className = `whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all filter-btn`;
            
            if(isActive) {
                btn.classList.add('bg-gradient-to-br', 'from-primary', 'to-primary-container', 'text-white');
            } else {
                btn.classList.add('bg-surface-container-highest', 'text-on-surface-variant', 'hover:bg-primary/10');
            }
            
            btn.dataset.category = cat;
            btn.textContent = cat;
            categoryFilters.appendChild(btn);
        });

        // Add click events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCategory = e.target.dataset.category;
                setupFilters(); // Re-render filters to update active state
                renderMenu();
            });
        });
    };

    // Fetch Menu Data
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data.items;
            categories = data.categories;
            setupFilters();
            renderMenu();
        })
        .catch(err => {
            console.error('Error fetching menu:', err);
            if(menuContainer) menuContainer.innerHTML = `<div class="col-span-full text-center py-10 text-error font-bold">Failed to load menu. Please try again later.</div>`;
        });

    // Search Logic
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderMenu();
        });
    }

    // --- 3. WhatsApp Form Logic ---
    const HOTEL_PHONE = "919876543210"; 

    const reservationForm = document.getElementById('reservation-form');
    if(reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('res-name').value;
            const phone = document.getElementById('res-phone').value;
            const guests = document.getElementById('res-guests').value;
            const date = document.getElementById('res-date').value;
            const time = document.getElementById('res-time').value;

            const message = `Hello Sarthi Hotel,\n\nI would like to request a table reservation.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Guests:* ${guests}\n*Date:* ${date}\n*Time:* ${time}\n\nPlease confirm availability. Thank you!`;
            const encodedMessage = encodeURIComponent(message);
            
            window.open(`https://wa.me/${HOTEL_PHONE}?text=${encodedMessage}`, '_blank');
        });
    }

    // --- 4. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
                header.classList.remove('shadow-[0px_20px_40px_rgba(29,29,3,0.04)]');
            } else {
                header.classList.remove('shadow-md');
                header.classList.add('shadow-[0px_20px_40px_rgba(29,29,3,0.04)]');
            }
        });
    }
});
