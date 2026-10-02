export type Locale = "ar" | "en";

export interface TranslationDictionary {
  navbar: {
    admin: string;
    logoAlt: string;
    favorites: string;
    cars: string;
  };
  hero: {
    title: string;
    subtitle: string;
    bookNow: string;
    heroAlt: string;
  };
  catalogue: {
    title: string;
    subtitle: string;
    searchManufacturerPlaceholder: string;
    searchModelPlaceholder: string;
    searchBrandPlaceholder: string;
    searchBtnAlt: string;
    carLogoAlt: string;
    carModelAlt: string;
    noCarsTitle: string;
    noCarsSubtitle: string;
    fuelFilterTitle: string;
    yearFilterTitle: string;
  };
  filters: {
    fuelOptions: Record<string, string>;
    yearDefaultTitle: string;
  };
  carCard: {
    currency: string;
    perDay: string;
    automatic: string;
    manual: string;
    mpg: string;
    viewDetails: string;
    steeringWheelAlt: string;
    tireAlt: string;
    gasAlt: string;
    statuses: Record<string, string>;
    addToFavorites: string;
    removeFromFavorites: string;
  };
  favoritesPage: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseCars: string;
    countBadge: (count: number) => string;
  };
  carsPage: {
    title: string;
    subtitle: string;
    breadcrumbHome: string;
    breadcrumbCars: string;
  };
  carDetailsPage: {
    backToCars: string;
    carNotFound: string;
    carNotFoundDesc: string;
    rentNow: string;
    specifications: string;
    overview: string;
    features: string;
    perDay: string;
  };
  carDetails: {
    close: string;
    specLabels: Record<string, string>;
    values: Record<string, string>;
  };
  pagination: {
    prev: string;
    next: string;
    pageOf: (page: number, total: number) => string;
    ariaLabel: string;
  };
  footer: {
    rightsReserved: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    sections: {
      about: string;
      howItWorks: string;
      featured: string;
      partnership: string;
      businessRelation: string;
      company: string;
      events: string;
      blog: string;
      podcast: string;
      inviteFriend: string;
      socials: string;
    };
  };
  adminLogin: {
    brand: string;
    backToSite: string;
    administration: string;
    carInventory: string;
    adminDesc: string;
    adminAccess: string;
    enterCodeDesc: string;
    accessCode: string;
    continue: string;
    verifying: string;
    invalidCode: string;
    networkError: string;
  };
  adminDashboard: {
    brand: string;
    dashboardTitle: string;
    viewSite: string;
    logout: string;
    manageDesc: string;
    addCar: string;
    editCar: string;
    cancel: string;
    saveCar: string;
    saving: string;
    stats: {
      totalCars: string;
      available: string;
      rented: string;
      maintenance: string;
    };
    carsCount: (count: number) => string;
    searchPlaceholder: string;
    searchAria: string;
    filterAria: string;
    allStatuses: string;
    sortByLabel: string;
    sortOptions: {
      default: string;
      priceAsc: string;
      priceDesc: string;
      yearDesc: string;
      yearAsc: string;
      mileageAsc: string;
      brandAsc: string;
      brandDesc: string;
    };
    showingResults: (from: number, to: number, total: number) => string;
    pageOf: (page: number, total: number) => string;
    prev: string;
    next: string;
    loading: string;
    noCars: string;
    edit: string;
    delete: string;
    noDescription: string;
    confirmDelete: (name: string) => string;
    deletedNotice: (name: string) => string;
    statusNotice: (name: string, status: string) => string;
    updatedNotice: string;
    addedNotice: string;
    loadError: string;
    saveError: string;
    statusError: string;
    deleteError: string;
    backToDashboard: string;
    addVehicleTitle: string;
    addVehicleDesc: string;
    editVehicleTitle: string;
    editVehicleDesc: string;
    chooseImages: string;
    dragDropImages: string;
    uploadHint: string;
    selectedImages: (count: number) => string;
    noImagesSelected: string;
    mainCover: string;
    setAsCover: string;
    removePhoto: string;
    newPhotoBadge: string;
    existingPhotoBadge: string;
    basicInfoSection: string;
    pricingStatusSection: string;
    performanceSection: string;
    appearanceSection: string;
    imagesSection: string;
    imagesSectionDesc: string;
    featuresDescSection: string;
    saveVehicle: string;
    saveChanges: string;
    savingVehicle: string;
    vehicleNotFound: string;
    vehicleNotFoundDesc: string;
    imagesRequiredError: string;
    fields: {
      name: string;
      brand: string;
      model: string;
      year: string;
      price: string;
      availability: string;
      fuelType: string;
      transmission: string;
      drive: string;
      cityMpg: string;
      highwayMpg: string;
      cylinders: string;
      displacement: string;
      vehicleClass: string;
      color: string;
      horsepower: string;
      imageUrls: string;
      imageUrlsPlaceholder: string;
      features: string;
      featuresPlaceholder: string;
      description: string;
      automatic: string;
      manual: string;
    };
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  ar: {
    navbar: {
      admin: "لوحة التحكم",
      logoAlt: "شعار معرض السيارات",
      favorites: "المفضلة",
      cars: "السيارات",
    },
    hero: {
      title: "ابحث، احجز، أو استأجر سيارة — بسرعة وسهولة!",
      subtitle: "سهّل تجربة استئجار سيارتك مع عملية حجز سلسة ومرنة تلبي كافة احتياجاتك.",
      bookNow: "احجز الآن",
      heroAlt: "سيارة العرض",
    },
    catalogue: {
      title: "كتالوج السيارات",
      subtitle: "استكشف أسطولنا المميز من أفضل ماركات السيارات العالمية الحديثة والفاخرة.",
      searchManufacturerPlaceholder: "الماركة...",
      searchModelPlaceholder: "الموديل...",
      searchBrandPlaceholder: "الماركة...",
      searchBtnAlt: "عدسة بحث",
      carLogoAlt: "شعار السيارة",
      carModelAlt: "موديل السيارة",
      noCarsTitle: "لم يتم العثور على سيارات",
      noCarsSubtitle: "حاول تغيير خيارات البحث أو استخدام معايير تصفية مختلفة.",
      fuelFilterTitle: "الوقود",
      yearFilterTitle: "السنة",
    },
    filters: {
      fuelOptions: {
        "": "نوع الوقود",
        Gas: "بنزين",
        Electricity: "كهرباء",
      },
      yearDefaultTitle: "سنة الصنع",
    },
    carCard: {
      currency: "EGP",
      perDay: "/يوم",
      automatic: "أوتوماتيك",
      manual: "يدوي",
      mpg: "ميل/غالون",
      viewDetails: "عرض التفاصيل",
      steeringWheelAlt: "عجلة القيادة",
      tireAlt: "الإطار",
      gasAlt: "الوقود",
      statuses: {
        available: "متاح",
        rented: "مؤجر",
        maintenance: "صيانة",
      },
      addToFavorites: "إضافة إلى المفضلة",
      removeFromFavorites: "إزالة من المفضلة",
    },
    favoritesPage: {
      title: "سياراتي المفضلة",
      subtitle: "السيارات التي قمت بحفظها لسهولة الوصول إليها لاحقاً.",
      emptyTitle: "لا توجد سيارات مفضلة بعد",
      emptySubtitle: "تصفح أسطول سياراتنا واضغط على أيقونة القلب على أي سيارة لحفظها هنا.",
      browseCars: "تصفح السيارات",
      countBadge: (count: number) => `${count} سيارة محفوظة`,
    },
    carsPage: {
      title: "جميع السيارات",
      subtitle: "تصفح أسطولنا الكامل من أحدث وأرقى السيارات المتاحة للحجز والاستئجار.",
      breadcrumbHome: "الرئيسية",
      breadcrumbCars: "السيارات",
    },
    carDetailsPage: {
      backToCars: "العودة إلى السيارات",
      carNotFound: "السيارة غير موجودة",
      carNotFoundDesc: "السيارة التي تبحث عنها غير متوفرة أو قد تم إزالتها من الأسطول.",
      rentNow: "حجز واستئجار الآن",
      specifications: "المواصفات الفنية",
      overview: "نظرة عامة",
      features: "المميزات الإضافية",
      perDay: "في اليوم",
    },
    carDetails: {
      close: "إغلاق",
      specLabels: {
        city_mpg: "استهلاك المدينة",
        highway_mpg: "استهلاك السريع",
        combination_mpg: "الاستهلاك المختلط",
        cylinders: "الأسطوانات",
        displacement: "سعة المحرك",
        drive: "نظام الدفع",
        fuel_type: "نوع الوقود",
        fuel: "نوع الوقود",
        transmission: "ناقل الحركة",
        make: "الشركة المصنعة",
        brand: "الماركة",
        model: "الموديل",
        class: "فئة المركبة",
        year: "سنة الصنع",
        price: "السعر",
        mileage: "المسافة المقطوعة",
        color: "اللون",
        horsepower: "القوة الحصانية",
        status: "حالة التوفر",
        features: "المميزات",
        description: "الوصف",
      },
      values: {
        Gas: "بنزين",
        Electricity: "كهرباء",
        gas: "بنزين",
        electricity: "كهرباء",
        a: "أوتوماتيك",
        m: "يدوي",
        fwd: "دفع أمامي (FWD)",
        rwd: "دفع خلفي (RWD)",
        awd: "دفع كلي (AWD)",
        "4wd": "دفع رباعي (4WD)",
        available: "متاح",
        rented: "مؤجر",
        maintenance: "صيانة",
      },
    },
    pagination: {
      prev: "السابق",
      next: "التالي",
      pageOf: (page, total) => `صفحة ${page} من ${total}`,
      ariaLabel: "صفحات قائمة السيارات",
    },
    footer: {
      rightsReserved: "جميع الحقوق محفوظة ©",
      copyright: "© 2024 كار شو روم. جميع الحقوق محفوظة.",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      sections: {
        about: "عن المعرض",
        howItWorks: "كيف يعمل النظام",
        featured: "سيارات مميزة",
        partnership: "الشراكات الاستراتيجية",
        businessRelation: "علاقات الأعمال",
        company: "الشركة",
        events: "الفعاليات والأخبار",
        blog: "المدونة",
        podcast: "البودكاست",
        inviteFriend: "دعوة صديق",
        socials: "وسائل التواصل",
      },
    },
    adminLogin: {
      brand: "معرض السيارات",
      backToSite: "العودة للموقع",
      administration: "بوابة الإدارة",
      carInventory: "مخزون السيارات",
      adminDesc: "أدخل رمز دخول المشرف لإدارة وتحديث قوائم السيارات المعروضة.",
      adminAccess: "تسجيل دخول المشرف",
      enterCodeDesc: "أدخل رمز الدخول المكوّن من 8 خانات للمتابعة.",
      accessCode: "رمز الدخول",
      continue: "متابعة",
      verifying: "جارٍ التحقق...",
      invalidCode: "تعذر التحقق من رمز الدخول. يرجى التأكد وإعادة المحاولة.",
      networkError: "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.",
    },
    adminDashboard: {
      brand: "معرض السيارات",
      dashboardTitle: "لوحة تحكم المخزون",
      viewSite: "عرض الموقع",
      logout: "تسجيل الخروج",
      manageDesc: "إدارة تفاصيل السيارات والأسعار وقوائم العرض العامة",
      addCar: "إضافة سيارة جديدة",
      editCar: "تعديل بيانات السيارة",
      cancel: "إلغاء",
      saveCar: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
      stats: {
        totalCars: "إجمالي السيارات",
        available: "متاح للحجز",
        rented: "مؤجر حالياً",
        maintenance: "تحت الصيانة",
      },
      carsCount: (count) => `قائمة السيارات (${count})`,
      searchPlaceholder: "ابحث بالاسم أو الماركة أو الموديل...",
      searchAria: "البحث في السيارات",
      filterAria: "تصفية حسب حالة التوفر",
      allStatuses: "جميع الحالات",
      sortByLabel: "الترتيب حسب:",
      sortOptions: {
        default: "الافتراضي",
        priceAsc: "السعر: من الأقل للأعلى",
        priceDesc: "السعر: من الأعلى للأقل",
        yearDesc: "سنة الصنع: الأحدث أولاً",
        yearAsc: "سنة الصنع: الأقدم أولاً",
        mileageAsc: "المسافة: الأقل أولاً",
        brandAsc: "الشركة: أ - ي",
        brandDesc: "الشركة: ي - أ",
      },
      showingResults: (from, to, total) => `عرض ${from}–${to} من أصل ${total} مركبة`,
      pageOf: (page, total) => `صفحة ${page} من ${total}`,
      prev: "السابق",
      next: "التالي",
      loading: "جارٍ تحميل مخزون السيارات...",
      noCars: "لا توجد سيارات تطابق معايير هذا البحث.",
      edit: "تعديل",
      delete: "حذف",
      noDescription: "لا يوجد وصف مدخل لهذه السيارة",
      confirmDelete: (name) => `هل أنت متأكد من حذف ${name} من المخزون نهائياً؟`,
      deletedNotice: (name) => `تم حذف ${name} من المخزون بنجاح.`,
      statusNotice: (name, status) => `تم تحديث حالة ${name} إلى ${status}.`,
      updatedNotice: "تم تحديث بيانات السيارة بنجاح.",
      addedNotice: "تمت إضافة السيارة الجديدة إلى المخزون بنجاح.",
      loadError: "تعذر تحميل مخزون السيارات.",
      saveError: "تعذر حفظ بيانات السيارة.",
      statusError: "تعذر تحديث حالة التوفر.",
      deleteError: "تعذر حذف هذه السيارة.",
      backToDashboard: "العودة للوحة التحكم",
      addVehicleTitle: "إضافة مركبة جديدة",
      addVehicleDesc: "أدخل تفاصيل ومواصفات المركبة وارفع صورها مباشرة من جهازك.",
      editVehicleTitle: "تعديل بيانات المركبة",
      editVehicleDesc: "قم بتعديل بيانات المركبة وإدارة ألبوم الصور الخاصة بها.",
      chooseImages: "اختيار الصور",
      dragDropImages: "اسحب وأفلت الصور هنا أو اضغط للاختيار من جهازك",
      uploadHint: "ملفات PNG أو JPG أو WEBP أو GIF حتى 10 ميجابايت لكل صورة. يمكنك اختيار عدة صور معاً.",
      selectedImages: (count) => `الصور المختارة (${count})`,
      noImagesSelected: "لم يتم اختيار أي صور للمركبة حتى الآن.",
      mainCover: "الصورة الرئيسية",
      setAsCover: "تعيين كرئيسية",
      removePhoto: "حذف الصورة",
      newPhotoBadge: "جديدة",
      existingPhotoBadge: "حالية",
      basicInfoSection: "المعلومات الأساسية",
      pricingStatusSection: "التسعير وحالة التوفر",
      performanceSection: "المواصفات الفنية والمحرك",
      appearanceSection: "المظهر الخارجي",
      imagesSection: "صور المركبة (من جهازك)",
      imagesSectionDesc: "ارفع صور حقيقية للمركبة مباشرة من جهاز الكمبيوتر أو الهاتف. يمكنك إزالة أو تعيين الصورة الرئيسية بسهولة.",
      featuresDescSection: "المميزات والوصف",
      saveVehicle: "إضافة المركبة للمخزون",
      saveChanges: "حفظ التعديلات",
      savingVehicle: "جارٍ رفع الصور وحفظ المركبة...",
      vehicleNotFound: "المركبة غير موجودة",
      vehicleNotFoundDesc: "تعذر العثور على المركبة بالمعرّف المحدد أو تم حذفها.",
      imagesRequiredError: "يرجى اختيار صورة واحدة على الأقل للمركبة من جهازك.",
      fields: {
        name: "اسم السيارة",
        brand: "الشركة المصنعة",
        model: "الموديل",
        year: "سنة الصنع",
        price: "السعر اليومي ($)",
        availability: "حالة التوفر",
        fuelType: "نوع الوقود",
        transmission: "ناقل الحركة",
        drive: "نظام الدفع",
        cityMpg: "استهلاك المدينة (MPG)",
        highwayMpg: "استهلاك السريع (MPG)",
        cylinders: "عدد الأسطوانات",
        displacement: "سعة المحرك (لتر)",
        vehicleClass: "فئة المركبة",
        color: "اللون الخارجي",
        horsepower: "القوة الحصانية (HP)",
        imageUrls: "روابط الصور",
        imageUrlsPlaceholder: "رابط صورة واحد لكل سطر (http(s) أو مسار محلي)",
        features: "المميزات الإضافية",
        featuresPlaceholder: "ميزة واحدة في كل سطر",
        description: "الوصف العام",
        automatic: "أوتوماتيك",
        manual: "يدوي",
      },
    },
  },
  en: {
    navbar: {
      admin: "Admin",
      logoAlt: "Car Showroom Logo",
      favorites: "Favorites",
      cars: "Cars",
    },
    hero: {
      title: "Find, book, or rent a car — quickly and easily!",
      subtitle: "Streamline your car rental experience with our effortless booking process.",
      bookNow: "Book Now",
      heroAlt: "hero",
    },
    catalogue: {
      title: "Car Catalogue",
      subtitle: "Explore our catalogue of cars from the best brands in the world.",
      searchManufacturerPlaceholder: "Brand...",
      searchModelPlaceholder: "Model...",
      searchBrandPlaceholder: "Brand...",
      searchBtnAlt: "magnifying glass",
      carLogoAlt: "car logo",
      carModelAlt: "car model",
      noCarsTitle: "No cars found",
      noCarsSubtitle: "Try adjusting your search criteria or filters.",
      fuelFilterTitle: "Fuel",
      yearFilterTitle: "Year",
    },
    filters: {
      fuelOptions: {
        "": "Fuel",
        Gas: "Gas",
        Electricity: "Electricity",
      },
      yearDefaultTitle: "Year",
    },
    carCard: {
      currency: "EGP",
      perDay: "/day",
      automatic: "Automatic",
      manual: "Manual",
      mpg: "MPG",
      viewDetails: "View Details",
      steeringWheelAlt: "steering wheel",
      tireAlt: "tire",
      gasAlt: "gas",
      statuses: {
        available: "available",
        rented: "rented",
        maintenance: "maintenance",
      },
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    favoritesPage: {
      title: "My Favorites",
      subtitle: "Cars you have saved for easy access and quick booking.",
      emptyTitle: "No favorite cars yet",
      emptySubtitle: "Browse our showroom fleet and click the heart icon on any car to save it here.",
      browseCars: "Browse Cars",
      countBadge: (count: number) => `${count} ${count === 1 ? "car" : "cars"} saved`,
    },
    carsPage: {
      title: "All Cars",
      subtitle: "Browse our complete inventory of luxury, sports, and everyday vehicles available for booking.",
      breadcrumbHome: "Home",
      breadcrumbCars: "Cars",
    },
    carDetailsPage: {
      backToCars: "Back to Cars",
      carNotFound: "Car Not Found",
      carNotFoundDesc: "The vehicle you are looking for is currently unavailable or has been removed.",
      rentNow: "Book & Rent Now",
      specifications: "Technical Specifications",
      overview: "Vehicle Overview",
      features: "Features & Amenities",
      perDay: "per day",
    },
    carDetails: {
      close: "close",
      specLabels: {
        city_mpg: "City MPG",
        highway_mpg: "Highway MPG",
        combination_mpg: "Combined MPG",
        cylinders: "Cylinders",
        displacement: "Displacement",
        drive: "Drive",
        fuel_type: "Fuel Type",
        fuel: "Fuel",
        transmission: "Transmission",
        make: "Manufacturer",
        brand: "Brand",
        model: "Model",
        class: "Class",
        year: "Year",
        price: "Price",
        mileage: "Mileage",
        color: "Color",
        horsepower: "Horsepower",
        status: "Status",
        features: "Features",
        description: "Description",
      },
      values: {
        Gas: "Gas",
        Electricity: "Electricity",
        gas: "Gas",
        electricity: "Electricity",
        a: "Automatic",
        m: "Manual",
        fwd: "FWD",
        rwd: "RWD",
        awd: "AWD",
        "4wd": "4WD",
        available: "Available",
        rented: "Rented",
        maintenance: "Maintenance",
      },
    },
    pagination: {
      prev: "Previous",
      next: "Next",
      pageOf: (page, total) => `Page ${page} of ${total}`,
      ariaLabel: "Car listing pages",
    },
    footer: {
      rightsReserved: "All Rights Reserved ©",
      copyright: "@2024 CarShowroom. All Rights Reserved",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      sections: {
        about: "About",
        howItWorks: "How it works",
        featured: "Featured",
        partnership: "Partnership",
        businessRelation: "Business Relation",
        company: "Company",
        events: "Events",
        blog: "Blog",
        podcast: "Podcast",
        inviteFriend: "Invite a friend",
        socials: "Socials",
      },
    },
    adminLogin: {
      brand: "Car Showroom",
      backToSite: "Back to site",
      administration: "Administration",
      carInventory: "Car inventory",
      adminDesc: "Enter the administrator access code to manage showroom listings.",
      adminAccess: "Admin access",
      enterCodeDesc: "Enter your 8-character access code.",
      accessCode: "Access code",
      continue: "Continue",
      verifying: "Verifying...",
      invalidCode: "Unable to verify the access code.",
      networkError: "Unable to reach the server. Please try again.",
    },
    adminDashboard: {
      brand: "Car Showroom",
      dashboardTitle: "Inventory dashboard",
      viewSite: "View site",
      logout: "Log out",
      manageDesc: "Manage cars and public listing details",
      addCar: "Add car",
      editCar: "Edit car",
      cancel: "Cancel",
      saveCar: "Save car",
      saving: "Saving...",
      stats: {
        totalCars: "Total cars",
        available: "Available",
        rented: "Rented",
        maintenance: "Maintenance",
      },
      carsCount: (count) => `Cars (${count})`,
      searchPlaceholder: "Search cars",
      searchAria: "Search cars",
      filterAria: "Filter by availability",
      allStatuses: "All statuses",
      sortByLabel: "Sort by:",
      sortOptions: {
        default: "Default",
        priceAsc: "Price: Low to High",
        priceDesc: "Price: High to Low",
        yearDesc: "Year: Newest First",
        yearAsc: "Year: Oldest First",
        mileageAsc: "Mileage: Lowest First",
        brandAsc: "Brand: A to Z",
        brandDesc: "Brand: Z to A",
      },
      showingResults: (from, to, total) => `Showing ${from}–${to} of ${total} vehicles`,
      pageOf: (page, total) => `Page ${page} of ${total}`,
      prev: "Previous",
      next: "Next",
      loading: "Loading inventory...",
      noCars: "No cars match this search.",
      edit: "Edit",
      delete: "Delete",
      noDescription: "No description",
      confirmDelete: (name) => `Delete ${name} from the inventory? This cannot be undone.`,
      deletedNotice: (name) => `${name} deleted.`,
      statusNotice: (name, status) => `${name} marked ${status}.`,
      updatedNotice: "Car details updated.",
      addedNotice: "Car added to the inventory.",
      loadError: "Unable to load the car inventory.",
      saveError: "Unable to save this car.",
      statusError: "Unable to update availability.",
      deleteError: "Unable to delete this car.",
      backToDashboard: "Back to Dashboard",
      addVehicleTitle: "Add New Vehicle",
      addVehicleDesc: "Fill in vehicle specifications and upload photos directly from your device.",
      editVehicleTitle: "Edit Vehicle",
      editVehicleDesc: "Update vehicle specifications and manage gallery photos.",
      chooseImages: "Choose Images",
      dragDropImages: "Drag & drop images here or click to browse from device",
      uploadHint: "PNG, JPG, WEBP or GIF up to 10MB each. You can select multiple images.",
      selectedImages: (count) => `Selected Photos (${count})`,
      noImagesSelected: "No photos selected for this vehicle yet.",
      mainCover: "Main Cover",
      setAsCover: "Set as Cover",
      removePhoto: "Remove Photo",
      newPhotoBadge: "New",
      existingPhotoBadge: "Current",
      basicInfoSection: "Basic Information",
      pricingStatusSection: "Pricing & Availability",
      performanceSection: "Technical Specifications & Engine",
      appearanceSection: "Exterior Appearance",
      imagesSection: "Vehicle Photos (From Your Device)",
      imagesSectionDesc: "Upload real photos directly from your computer. No URLs required. You can preview, remove, or set the cover photo.",
      featuresDescSection: "Features & Description",
      saveVehicle: "Add Vehicle to Inventory",
      saveChanges: "Save Changes",
      savingVehicle: "Uploading photos & saving vehicle...",
      vehicleNotFound: "Vehicle Not Found",
      vehicleNotFoundDesc: "The requested vehicle could not be found or has been removed.",
      imagesRequiredError: "Please select at least one photo for the vehicle from your device.",
      fields: {
        name: "Name",
        brand: "Brand / Make",
        model: "Model",
        year: "Year",
        price: "Daily Rate ($)",
        availability: "Availability",
        fuelType: "Fuel Type",
        transmission: "Transmission",
        drive: "Drive Train",
        cityMpg: "City MPG",
        highwayMpg: "Highway MPG",
        cylinders: "Cylinders",
        displacement: "Displacement (L)",
        vehicleClass: "Vehicle Class",
        color: "Exterior Color",
        horsepower: "Horsepower (HP)",
        imageUrls: "Image URLs",
        imageUrlsPlaceholder: "One http(s) or site-relative image URL per line",
        features: "Features",
        featuresPlaceholder: "One feature per line (e.g. Sunroof, Leather Seats)",
        description: "Description",
        automatic: "Automatic",
        manual: "Manual",
      },
    },
  },
};
