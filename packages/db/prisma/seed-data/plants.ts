export interface CategorySeed {
  name: string;
  nameEn: string;
  icon: string;
  order: number;
}

export interface VarietySeed {
  name: string;
  maturityDays?: number;
  frostResistance: string;
  yieldDescription?: string;
}

export interface SpeciesSeed {
  name: string;
  nameScientific: string;
  categoryNameEn: string;
  wateringIntervalDays: number;
  wateringNormLiters: number;
  sunRequirement: string;
  soilType: string;
  description: string;
  varieties: VarietySeed[];
}

export const categories: CategorySeed[] = [
  { name: 'Плодовые деревья', nameEn: 'trees', icon: '🌳', order: 1 },
  { name: 'Виноград', nameEn: 'grapes', icon: '🍇', order: 2 },
  { name: 'Овощи', nameEn: 'vegetables', icon: '🥕', order: 3 },
  { name: 'Ягоды', nameEn: 'berries', icon: '🍓', order: 4 },
  { name: 'Кустарники', nameEn: 'shrubs', icon: '🌿', order: 5 },
  { name: 'Травы и зелень', nameEn: 'herbs', icon: '🌾', order: 6 },
];

export const species: SpeciesSeed[] = [
  // =====================
  // ПЛОДОВЫЕ ДЕРЕВЬЯ
  // =====================
  {
    name: 'Яблоня',
    nameScientific: 'Malus domestica',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 40,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Самое распространённое плодовое дерево в российских садах. Неприхотлива, при правильном уходе плодоносит ежегодно и обильно.',
    varieties: [
      { name: 'Антоновка', maturityDays: 140, frostResistance: 'VERY_HIGH', yieldDescription: '150-200 кг с дерева' },
      { name: 'Белый налив', maturityDays: 90, frostResistance: 'HIGH', yieldDescription: '60-80 кг с дерева' },
      { name: 'Мельба', maturityDays: 110, frostResistance: 'MEDIUM', yieldDescription: '80-120 кг с дерева' },
      { name: 'Симиренко', maturityDays: 160, frostResistance: 'MEDIUM', yieldDescription: '100-150 кг с дерева' },
      { name: 'Грушовка московская', maturityDays: 85, frostResistance: 'VERY_HIGH', yieldDescription: '80-100 кг с дерева' },
    ],
  },
  {
    name: 'Груша',
    nameScientific: 'Pyrus communis',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 40,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивое плодовое дерево с сочными сладкими плодами. Современные сорта хорошо растут в средней полосе России.',
    varieties: [
      { name: 'Лада', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '40-50 кг с дерева' },
      { name: 'Чижовская', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '50-60 кг с дерева' },
      { name: 'Дюшес', maturityDays: 130, frostResistance: 'MEDIUM', yieldDescription: '80-100 кг с дерева' },
    ],
  },
  {
    name: 'Вишня',
    nameScientific: 'Prunus cerasus',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 30,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Популярная косточковая культура. Ценится за вкусные плоды, используемые в свежем виде, для варенья, компотов и выпечки.',
    varieties: [
      { name: 'Владимирская', maturityDays: 110, frostResistance: 'VERY_HIGH', yieldDescription: '20-25 кг с дерева' },
      { name: 'Шоколадница', maturityDays: 105, frostResistance: 'HIGH', yieldDescription: '10-15 кг с дерева' },
      { name: 'Молодёжная', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '10-12 кг с дерева' },
    ],
  },
  {
    name: 'Слива',
    nameScientific: 'Prunus domestica',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 35,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Косточковое плодовое дерево с разнообразными сортами. Плоды используются в свежем виде, для заготовок и сушки (чернослив).',
    varieties: [
      { name: 'Ренклод', maturityDays: 130, frostResistance: 'MEDIUM', yieldDescription: '25-40 кг с дерева' },
      { name: 'Венгерка', maturityDays: 140, frostResistance: 'HIGH', yieldDescription: '30-50 кг с дерева' },
      { name: 'Евразия 21', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '20-30 кг с дерева' },
    ],
  },
  {
    name: 'Черешня',
    nameScientific: 'Prunus avium',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 40,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Сладкая косточковая культура с крупными плодами. В последние годы выведены зимостойкие сорта для средней полосы.',
    varieties: [
      { name: 'Ипуть', maturityDays: 95, frostResistance: 'HIGH', yieldDescription: '25-35 кг с дерева' },
      { name: 'Ревна', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '20-30 кг с дерева' },
    ],
  },
  {
    name: 'Абрикос',
    nameScientific: 'Prunus armeniaca',
    categoryNameEn: 'trees',
    wateringIntervalDays: 14,
    wateringNormLiters: 40,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивое косточковое дерево. Современные сорта адаптированы к условиям средней полосы и выдерживают морозы до -30°C.',
    varieties: [
      { name: 'Триумф северный', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '40-60 кг с дерева' },
      { name: 'Лель', maturityDays: 90, frostResistance: 'HIGH', yieldDescription: '20-30 кг с дерева' },
    ],
  },
  {
    name: 'Персик',
    nameScientific: 'Prunus persica',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 35,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Теплолюбивая культура, успешно выращиваемая в южных регионах России. Требует защиты от курчавости листьев.',
    varieties: [
      { name: 'Редхейвен', maturityDays: 125, frostResistance: 'LOW', yieldDescription: '40-60 кг с дерева' },
      { name: 'Золотой юбилей', maturityDays: 115, frostResistance: 'MEDIUM', yieldDescription: '30-50 кг с дерева' },
    ],
  },
  {
    name: 'Алыча',
    nameScientific: 'Prunus cerasifera',
    categoryNameEn: 'trees',
    wateringIntervalDays: 10,
    wateringNormLiters: 30,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Неприхотливая косточковая культура с обильным плодоношением. Гибридные сорта отличаются крупными плодами и высокой зимостойкостью.',
    varieties: [
      { name: 'Кубанская комета', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '30-50 кг с дерева' },
      { name: 'Злато скифов', maturityDays: 95, frostResistance: 'HIGH', yieldDescription: '25-35 кг с дерева' },
    ],
  },

  // =====================
  // ВИНОГРАД
  // =====================
  {
    name: 'Виноград столовый',
    nameScientific: 'Vitis vinifera',
    categoryNameEn: 'grapes',
    wateringIntervalDays: 7,
    wateringNormLiters: 20,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Столовые сорта винограда предназначены для употребления в свежем виде. Требуют укрытия на зиму в большинстве регионов России.',
    varieties: [
      { name: 'Аркадия', maturityDays: 120, frostResistance: 'MEDIUM', yieldDescription: '6-8 кг с куста' },
      { name: 'Кодрянка', maturityDays: 110, frostResistance: 'MEDIUM', yieldDescription: '5-7 кг с куста' },
      { name: 'Лора', maturityDays: 115, frostResistance: 'MEDIUM', yieldDescription: '6-8 кг с куста' },
    ],
  },
  {
    name: 'Виноград технический',
    nameScientific: 'Vitis vinifera',
    categoryNameEn: 'grapes',
    wateringIntervalDays: 10,
    wateringNormLiters: 15,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Технические сорта используются для виноделия и переработки. Многие неукрывные сорта подходят для средней полосы.',
    varieties: [
      { name: 'Изабелла', maturityDays: 150, frostResistance: 'HIGH', yieldDescription: '4-6 кг с куста' },
      { name: 'Саперави', maturityDays: 160, frostResistance: 'LOW', yieldDescription: '5-8 кг с куста' },
    ],
  },
  {
    name: 'Виноград кишмиш',
    nameScientific: 'Vitis vinifera',
    categoryNameEn: 'grapes',
    wateringIntervalDays: 7,
    wateringNormLiters: 20,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Бессемянные сорта винограда, популярные для употребления в свежем виде и изготовления изюма.',
    varieties: [
      { name: 'Кишмиш 342', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '5-7 кг с куста' },
      { name: 'Кишмиш лучистый', maturityDays: 130, frostResistance: 'MEDIUM', yieldDescription: '6-8 кг с куста' },
    ],
  },

  // =====================
  // ОВОЩИ
  // =====================
  {
    name: 'Томат',
    nameScientific: 'Solanum lycopersicum',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 3,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Одна из самых популярных овощных культур в России. Выращивается в теплицах и открытом грунте, имеет огромное разнообразие сортов.',
    varieties: [
      { name: 'Бычье сердце', maturityDays: 120, frostResistance: 'LOW', yieldDescription: '5-8 кг с куста' },
      { name: 'Де Барао', maturityDays: 125, frostResistance: 'LOW', yieldDescription: '6-10 кг с куста' },
      { name: 'Чёрный принц', maturityDays: 115, frostResistance: 'LOW', yieldDescription: '3-5 кг с куста' },
      { name: 'Санька', maturityDays: 80, frostResistance: 'LOW', yieldDescription: '3-4 кг с куста' },
      { name: 'Розовый мёд', maturityDays: 110, frostResistance: 'LOW', yieldDescription: '4-6 кг с куста' },
    ],
  },
  {
    name: 'Огурец',
    nameScientific: 'Cucumis sativus',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 2,
    wateringNormLiters: 3,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Теплолюбивая культура, незаменимая в русской кухне. Современные гибриды дают обильный урожай как в теплице, так и в открытом грунте.',
    varieties: [
      { name: 'Кураж F1', maturityDays: 45, frostResistance: 'LOW', yieldDescription: '12-16 кг/м²' },
      { name: 'Герман F1', maturityDays: 40, frostResistance: 'LOW', yieldDescription: '15-20 кг/м²' },
      { name: 'Конкурент', maturityDays: 50, frostResistance: 'LOW', yieldDescription: '3-5 кг/м²' },
    ],
  },
  {
    name: 'Перец сладкий',
    nameScientific: 'Capsicum annuum',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 3,
    wateringNormLiters: 3,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивая овощная культура, богатая витамином C. В средней полосе выращивается через рассаду, в южных регионах — в открытом грунте.',
    varieties: [
      { name: 'Калифорнийское чудо', maturityDays: 120, frostResistance: 'LOW', yieldDescription: '5-8 кг/м²' },
      { name: 'Атлант', maturityDays: 110, frostResistance: 'LOW', yieldDescription: '6-8 кг/м²' },
      { name: 'Богатырь', maturityDays: 115, frostResistance: 'LOW', yieldDescription: '5-7 кг/м²' },
    ],
  },
  {
    name: 'Баклажан',
    nameScientific: 'Solanum melongena',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 3,
    wateringNormLiters: 4,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивая культура из семейства паслёновых. Требует длинного тёплого периода, в средней полосе выращивается в теплицах.',
    varieties: [
      { name: 'Чёрный красавец', maturityDays: 120, frostResistance: 'LOW', yieldDescription: '4-6 кг/м²' },
      { name: 'Алмаз', maturityDays: 110, frostResistance: 'LOW', yieldDescription: '5-8 кг/м²' },
    ],
  },
  {
    name: 'Картофель',
    nameScientific: 'Solanum tuberosum',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 7,
    wateringNormLiters: 10,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Важнейшая продовольственная культура России. Неприхотлива, даёт хороший урожай при правильном окучивании и борьбе с вредителями.',
    varieties: [
      { name: 'Невский', maturityDays: 90, frostResistance: 'MEDIUM', yieldDescription: '300-400 кг с сотки' },
      { name: 'Ред Скарлетт', maturityDays: 75, frostResistance: 'MEDIUM', yieldDescription: '250-350 кг с сотки' },
      { name: 'Жуковский ранний', maturityDays: 60, frostResistance: 'MEDIUM', yieldDescription: '200-300 кг с сотки' },
    ],
  },
  {
    name: 'Морковь',
    nameScientific: 'Daucus carota',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 5,
    wateringNormLiters: 4,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Двулетнее корнеплодное растение, одна из самых востребованных овощных культур. Предпочитает рыхлые, глубоко обработанные почвы.',
    varieties: [
      { name: 'Нантская', maturityDays: 100, frostResistance: 'MEDIUM', yieldDescription: '5-7 кг/м²' },
      { name: 'Шантане', maturityDays: 110, frostResistance: 'MEDIUM', yieldDescription: '6-9 кг/м²' },
    ],
  },
  {
    name: 'Свёкла',
    nameScientific: 'Beta vulgaris',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 5,
    wateringNormLiters: 4,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Неприхотливый корнеплод, основа борща и винегрета. Хорошо хранится зимой, богата витаминами и минералами.',
    varieties: [
      { name: 'Бордо 237', maturityDays: 110, frostResistance: 'MEDIUM', yieldDescription: '4-8 кг/м²' },
      { name: 'Цилиндра', maturityDays: 100, frostResistance: 'MEDIUM', yieldDescription: '5-7 кг/м²' },
    ],
  },
  {
    name: 'Капуста белокочанная',
    nameScientific: 'Brassica oleracea var. capitata',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 3,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Традиционная русская овощная культура. Холодостойкая, влаголюбивая, используется для квашения, тушения и салатов.',
    varieties: [
      { name: 'Слава 1305', maturityDays: 120, frostResistance: 'HIGH', yieldDescription: '8-12 кг/м²' },
      { name: 'Амагер 611', maturityDays: 150, frostResistance: 'HIGH', yieldDescription: '6-8 кг/м²' },
    ],
  },
  {
    name: 'Лук репчатый',
    nameScientific: 'Allium cepa',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 5,
    wateringNormLiters: 3,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Незаменимая культура на каждом огороде. Выращивается из севка или семян, хорошо хранится в зимний период.',
    varieties: [
      { name: 'Штутгартер Ризен', maturityDays: 95, frostResistance: 'MEDIUM', yieldDescription: '3-5 кг/м²' },
      { name: 'Ред Барон', maturityDays: 100, frostResistance: 'MEDIUM', yieldDescription: '2-4 кг/м²' },
    ],
  },
  {
    name: 'Чеснок',
    nameScientific: 'Allium sativum',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 7,
    wateringNormLiters: 3,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Пряноароматическая луковичная культура. Озимый чеснок высаживают осенью, яровой — весной. Природный антисептик.',
    varieties: [
      { name: 'Любаша', maturityDays: 100, frostResistance: 'VERY_HIGH', yieldDescription: '2-3 кг/м²' },
      { name: 'Комсомолец', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '1.5-2 кг/м²' },
    ],
  },
  {
    name: 'Кабачок',
    nameScientific: 'Cucurbita pepo var. cylindrica',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 4,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Неприхотливая овощная культура с высокой урожайностью. Плоды используются в кулинарии и для зимних заготовок.',
    varieties: [
      { name: 'Цукеша', maturityDays: 50, frostResistance: 'LOW', yieldDescription: '8-12 кг с куста' },
      { name: 'Грибовский 37', maturityDays: 55, frostResistance: 'LOW', yieldDescription: '6-10 кг с куста' },
    ],
  },
  {
    name: 'Тыква',
    nameScientific: 'Cucurbita maxima',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 5,
    wateringNormLiters: 8,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Крупноплодная бахчевая культура с длительным сроком хранения. Богата каротином и витаминами.',
    varieties: [
      { name: 'Мускатная', maturityDays: 130, frostResistance: 'LOW', yieldDescription: '10-20 кг с куста' },
      { name: 'Улыбка', maturityDays: 90, frostResistance: 'MEDIUM', yieldDescription: '4-6 кг с куста' },
    ],
  },
  {
    name: 'Горох',
    nameScientific: 'Pisum sativum',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 4,
    wateringNormLiters: 3,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Холодостойкая бобовая культура, обогащающая почву азотом. Прекрасный предшественник для большинства овощей.',
    varieties: [
      { name: 'Амброзия', maturityDays: 55, frostResistance: 'HIGH', yieldDescription: '1-1.5 кг/м²' },
      { name: 'Сахарный 2', maturityDays: 60, frostResistance: 'HIGH', yieldDescription: '1-1.5 кг/м²' },
    ],
  },
  {
    name: 'Фасоль',
    nameScientific: 'Phaseolus vulgaris',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 4,
    wateringNormLiters: 3,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивая бобовая культура, богатая белком. Кустовые формы компактны и не требуют опоры.',
    varieties: [
      { name: 'Масляный король', maturityDays: 55, frostResistance: 'LOW', yieldDescription: '2-3 кг/м²' },
      { name: 'Сакса без волокна 615', maturityDays: 50, frostResistance: 'LOW', yieldDescription: '1.5-2.5 кг/м²' },
    ],
  },
  {
    name: 'Редис',
    nameScientific: 'Raphanus sativus var. radicula',
    categoryNameEn: 'vegetables',
    wateringIntervalDays: 2,
    wateringNormLiters: 2,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'SANDY',
    description: 'Самый скороспелый корнеплод, первый весенний овощ на столе. Холодостоек, высевается рано весной.',
    varieties: [
      { name: 'Жара', maturityDays: 22, frostResistance: 'HIGH', yieldDescription: '2-3 кг/м²' },
      { name: '18 дней', maturityDays: 18, frostResistance: 'HIGH', yieldDescription: '2-2.5 кг/м²' },
    ],
  },

  // =====================
  // ЯГОДЫ
  // =====================
  {
    name: 'Клубника',
    nameScientific: 'Fragaria × ananassa',
    categoryNameEn: 'berries',
    wateringIntervalDays: 3,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Любимая ягодная культура дачников. Ремонтантные сорта плодоносят с июня до заморозков, обычные — один раз в сезон.',
    varieties: [
      { name: 'Виктория', maturityDays: 60, frostResistance: 'MEDIUM', yieldDescription: '0.8-1.2 кг с куста' },
      { name: 'Клери', maturityDays: 55, frostResistance: 'MEDIUM', yieldDescription: '0.6-0.8 кг с куста' },
      { name: 'Альбион', maturityDays: 65, frostResistance: 'MEDIUM', yieldDescription: '1-2 кг с куста (ремонтантная)' },
    ],
  },
  {
    name: 'Малина',
    nameScientific: 'Rubus idaeus',
    categoryNameEn: 'berries',
    wateringIntervalDays: 5,
    wateringNormLiters: 8,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Многолетний ягодный кустарник с целебными свойствами. Ремонтантные сорта плодоносят на побегах текущего года.',
    varieties: [
      { name: 'Гусар', maturityDays: 90, frostResistance: 'HIGH', yieldDescription: '3-5 кг с куста' },
      { name: 'Полка', maturityDays: 100, frostResistance: 'MEDIUM', yieldDescription: '2-4 кг с куста' },
      { name: 'Геракл', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '2.5-4 кг с куста (ремонтантная)' },
    ],
  },
  {
    name: 'Ежевика',
    nameScientific: 'Rubus fruticosus',
    categoryNameEn: 'berries',
    wateringIntervalDays: 5,
    wateringNormLiters: 8,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Крупноплодная ягодная культура с высокой урожайностью. Бесшипные сорта облегчают сбор урожая.',
    varieties: [
      { name: 'Торнфри', maturityDays: 120, frostResistance: 'MEDIUM', yieldDescription: '5-8 кг с куста' },
      { name: 'Агавам', maturityDays: 100, frostResistance: 'HIGH', yieldDescription: '3-5 кг с куста' },
    ],
  },
  {
    name: 'Голубика',
    nameScientific: 'Vaccinium corymbosum',
    categoryNameEn: 'berries',
    wateringIntervalDays: 3,
    wateringNormLiters: 6,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'PEATY',
    description: 'Ягодная культура, требующая кислой почвы (pH 3.5-4.5). Богата антиоксидантами, хорошо зимует в средней полосе.',
    varieties: [
      { name: 'Блюкроп', maturityDays: 130, frostResistance: 'HIGH', yieldDescription: '4-6 кг с куста' },
      { name: 'Патриот', maturityDays: 110, frostResistance: 'VERY_HIGH', yieldDescription: '3-5 кг с куста' },
    ],
  },
  {
    name: 'Жимолость',
    nameScientific: 'Lonicera caerulea',
    categoryNameEn: 'berries',
    wateringIntervalDays: 5,
    wateringNormLiters: 5,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Самая ранняя ягода в саду, созревает раньше земляники. Исключительно морозостойка, выдерживает до -50°C.',
    varieties: [
      { name: 'Голубое веретено', maturityDays: 70, frostResistance: 'VERY_HIGH', yieldDescription: '1.5-2.5 кг с куста' },
      { name: 'Синяя птица', maturityDays: 75, frostResistance: 'VERY_HIGH', yieldDescription: '1-2 кг с куста' },
    ],
  },

  // =====================
  // КУСТАРНИКИ
  // =====================
  {
    name: 'Смородина чёрная',
    nameScientific: 'Ribes nigrum',
    categoryNameEn: 'shrubs',
    wateringIntervalDays: 7,
    wateringNormLiters: 10,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Витаминная ягодная культура, рекордсмен по содержанию витамина C. Неприхотлива, плодоносит ежегодно при минимальном уходе.',
    varieties: [
      { name: 'Ядрёная', maturityDays: 90, frostResistance: 'VERY_HIGH', yieldDescription: '3-6 кг с куста' },
      { name: 'Добрыня', maturityDays: 85, frostResistance: 'HIGH', yieldDescription: '2-4 кг с куста' },
    ],
  },
  {
    name: 'Смородина красная',
    nameScientific: 'Ribes rubrum',
    categoryNameEn: 'shrubs',
    wateringIntervalDays: 7,
    wateringNormLiters: 10,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Высокоурожайная ягодная культура с кисловатыми плодами. Идеальна для желе, компотов и зимних заготовок.',
    varieties: [
      { name: 'Натали', maturityDays: 85, frostResistance: 'HIGH', yieldDescription: '3-5 кг с куста' },
      { name: 'Джонкер Ван Тетс', maturityDays: 80, frostResistance: 'HIGH', yieldDescription: '4-6 кг с куста' },
    ],
  },
  {
    name: 'Крыжовник',
    nameScientific: 'Ribes uva-crispa',
    categoryNameEn: 'shrubs',
    wateringIntervalDays: 7,
    wateringNormLiters: 8,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Северный виноград — так называют крыжовник за его вкус и урожайность. Современные сорта устойчивы к мучнистой росе.',
    varieties: [
      { name: 'Русский', maturityDays: 95, frostResistance: 'HIGH', yieldDescription: '4-6 кг с куста' },
      { name: 'Финик', maturityDays: 110, frostResistance: 'HIGH', yieldDescription: '5-8 кг с куста' },
    ],
  },
  {
    name: 'Облепиха',
    nameScientific: 'Hippophae rhamnoides',
    categoryNameEn: 'shrubs',
    wateringIntervalDays: 14,
    wateringNormLiters: 10,
    sunRequirement: 'FULL_SUN',
    soilType: 'SANDY',
    description: 'Уникальная ягодная культура с высоким содержанием витаминов и масел. Двудомное растение: для плодоношения нужны мужские и женские экземпляры.',
    varieties: [
      { name: 'Чуйская', maturityDays: 100, frostResistance: 'VERY_HIGH', yieldDescription: '8-12 кг с куста' },
      { name: 'Елизавета', maturityDays: 95, frostResistance: 'VERY_HIGH', yieldDescription: '6-10 кг с куста' },
    ],
  },
  {
    name: 'Калина',
    nameScientific: 'Viburnum opulus',
    categoryNameEn: 'shrubs',
    wateringIntervalDays: 10,
    wateringNormLiters: 10,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Декоративный и ягодный кустарник с целебными свойствами. Ягоды становятся сладкими после первых заморозков.',
    varieties: [
      { name: 'Таёжные рубины', maturityDays: 120, frostResistance: 'VERY_HIGH', yieldDescription: '4-6 кг с куста' },
    ],
  },

  // =====================
  // ТРАВЫ И ЗЕЛЕНЬ
  // =====================
  {
    name: 'Укроп',
    nameScientific: 'Anethum graveolens',
    categoryNameEn: 'herbs',
    wateringIntervalDays: 3,
    wateringNormLiters: 2,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Главная пряная зелень русской кухни. Холодостоек, быстро отрастает при регулярном срезе, размножается самосевом.',
    varieties: [
      { name: 'Грибовский', maturityDays: 35, frostResistance: 'HIGH', yieldDescription: '1-2 кг/м²' },
      { name: 'Аллигатор', maturityDays: 45, frostResistance: 'HIGH', yieldDescription: '1.5-2.5 кг/м²' },
    ],
  },
  {
    name: 'Петрушка',
    nameScientific: 'Petroselinum crispum',
    categoryNameEn: 'herbs',
    wateringIntervalDays: 4,
    wateringNormLiters: 2,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Двулетнее пряное растение, используется как зелень и приправа. Корневая петрушка также ценится как корнеплод.',
    varieties: [
      { name: 'Обыкновенная листовая', maturityDays: 60, frostResistance: 'HIGH', yieldDescription: '1-2 кг/м²' },
      { name: 'Итальянский гигант', maturityDays: 70, frostResistance: 'HIGH', yieldDescription: '2-3 кг/м²' },
    ],
  },
  {
    name: 'Базилик',
    nameScientific: 'Ocimum basilicum',
    categoryNameEn: 'herbs',
    wateringIntervalDays: 2,
    wateringNormLiters: 1.5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    description: 'Теплолюбивая пряная трава с ярким ароматом. Незаменим в средиземноморской и кавказской кухне, хорошо растёт в теплице.',
    varieties: [
      { name: 'Геновезе', maturityDays: 65, frostResistance: 'LOW', yieldDescription: '1-2 кг/м²' },
      { name: 'Фиолетовый', maturityDays: 70, frostResistance: 'LOW', yieldDescription: '1-1.5 кг/м²' },
    ],
  },
  {
    name: 'Мята',
    nameScientific: 'Mentha',
    categoryNameEn: 'herbs',
    wateringIntervalDays: 3,
    wateringNormLiters: 2,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Многолетнее пряное растение с освежающим ароматом. Быстро разрастается, используется в кулинарии и народной медицине.',
    varieties: [
      { name: 'Перечная', maturityDays: 80, frostResistance: 'HIGH', yieldDescription: '1-2 кг/м²' },
      { name: 'Кудрявая', maturityDays: 75, frostResistance: 'HIGH', yieldDescription: '1-1.5 кг/м²' },
    ],
  },
  {
    name: 'Кинза',
    nameScientific: 'Coriandrum sativum',
    categoryNameEn: 'herbs',
    wateringIntervalDays: 3,
    wateringNormLiters: 2,
    sunRequirement: 'PARTIAL_SHADE',
    soilType: 'LOAMY',
    description: 'Пряная зелень и специя (кориандр — её семена). Быстро уходит в цвет при жаре, поэтому высевается конвейерным способом.',
    varieties: [
      { name: 'Бородинский', maturityDays: 40, frostResistance: 'MEDIUM', yieldDescription: '1-2 кг/м²' },
      { name: 'Янтарь', maturityDays: 35, frostResistance: 'MEDIUM', yieldDescription: '1-1.5 кг/м²' },
    ],
  },
];
