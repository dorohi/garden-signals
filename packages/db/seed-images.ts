import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve('../server/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Better search queries: name -> array of search terms to try
const diseaseSearchTerms: Record<string, string[]> = {
  'Парша яблони': ['Venturia inaequalis', 'apple scab disease', 'парша яблони листья'],
  'Монилиоз': ['Monilinia fructigena', 'moniliosis fruit rot', 'монилиоз плоды'],
  'Фитофтороз': ['Phytophthora infestans', 'late blight tomato', 'фитофтороз томат'],
  'Мучнистая роса': ['powdery mildew plant', 'Erysiphe plant disease', 'мучнистая роса огурец'],
  'Ложная мучнистая роса (милдью)': ['Plasmopara viticola', 'downy mildew grape', 'милдью винограда'],
  'Оидиум': ['Uncinula necator grape', 'oidium grape powdery mildew', 'оидиум виноград'],
  'Чёрная ножка': ['damping off seedling', 'Pythium seedling', 'чёрная ножка рассада'],
  'Серая гниль': ['Botrytis cinerea', 'gray mold strawberry', 'серая гниль клубника'],
  'Ржавчина': ['Puccinia plant rust', 'rust disease leaf plant', 'ржавчина растений листья'],
  'Бактериальный ожог': ['Erwinia amylovora', 'fire blight pear', 'бактериальный ожог груша'],
  'Коккомикоз': ['Blumeriella jaapii cherry', 'coccomyces cherry leaf', 'коккомикоз вишня'],
  'Клястероспориоз': ['Clasterosporium carpophilum', 'shot hole disease stone fruit'],
  'Антракноз': ['Colletotrichum anthracnose plant', 'anthracnose currant berry'],
  'Вертициллёзное увядание': ['Verticillium dahliae wilt', 'verticillium wilt tomato'],
  'Фузариоз': ['Fusarium oxysporum wilt plant', 'fusarium wilt tomato'],
  'Альтернариоз': ['Alternaria solani early blight', 'alternaria leaf spot'],
  'Кила капусты': ['Plasmodiophora brassicae', 'clubroot cabbage disease'],
  'Курчавость листьев': ['Taphrina deformans peach', 'peach leaf curl disease'],
  'Чёрная пятнистость': ['Diplocarpon rosae black spot', 'black spot plant disease'],
  'Белая пятнистость (септориоз)': ['Septoria leaf spot plant', 'septoria tritici blotch'],
  'Корневая гниль': ['root rot plant disease Pythium', 'damping off root rot'],
  'Вершинная гниль': ['blossom end rot tomato', 'calcium deficiency tomato fruit'],
  'Пероноспороз': ['Peronospora destructor onion', 'downy mildew onion'],
  'Цитоспороз': ['Cytospora canker tree bark', 'cytospora apple tree'],
  'Камедетечение (гоммоз)': ['gummosis stone fruit tree', 'cherry gummosis bark'],
  'Хлороз': ['iron chlorosis plant leaf', 'interveinal chlorosis'],
  'Бактериальный рак': ['Agrobacterium tumefaciens crown gall', 'bacterial canker tree'],
  'Кладоспориоз (бурая пятнистость)': ['Cladosporium fulvum tomato', 'leaf mold tomato'],
  'Аскохитоз': ['Ascochyta blight pea cucumber', 'ascochyta leaf spot'],
  'Церкоспороз': ['Cercospora leaf spot beet', 'cercospora beticola'],
};

const pestSearchTerms: Record<string, string[]> = {
  'Тля': ['aphid plant colony', 'Aphididae garden pest', 'тля на растении колония'],
  'Колорадский жук': ['Leptinotarsa decemlineata', 'Colorado potato beetle larva', 'колорадский жук личинки'],
  'Паутинный клещ': ['Tetranychus urticae', 'spider mite plant web', 'паутинный клещ растение'],
  'Белокрылка': ['Trialeurodes vaporariorum', 'whitefly greenhouse plant', 'белокрылка теплица'],
  'Медведка': ['Gryllotalpa gryllotalpa', 'mole cricket garden', 'медведка огород'],
  'Проволочник': ['Agriotes wireworm larva', 'click beetle wireworm potato'],
  'Слизни': ['garden slug pest', 'Arion slug damage plant', 'слизни огород'],
  'Плодожорка яблонная': ['Cydia pomonella', 'codling moth apple larva', 'плодожорка яблоня'],
  'Долгоносик': ['Anthonomus pomorum weevil', 'apple blossom weevil', 'долгоносик яблоня'],
  'Крестоцветная блошка': ['Phyllotreta flea beetle', 'crucifer flea beetle cabbage'],
  'Капустная белянка': ['Pieris brassicae caterpillar', 'cabbage butterfly larva', 'капустница гусеница'],
  'Луковая муха': ['Delia antiqua onion fly', 'onion fly maggot'],
  'Морковная муха': ['Psila rosae carrot fly', 'carrot rust fly larva'],
  'Малинный жук': ['Byturus tomentosus', 'raspberry beetle larva'],
  'Земляничный клещ': ['Phytonemus pallidus strawberry', 'strawberry mite damage'],
  'Щитовка': ['scale insect plant', 'Diaspididae scale bark', 'щитовка на растении'],
  'Листовёртка': ['Tortricidae leaf roller', 'leaf roller caterpillar garden'],
  'Трипсы': ['Thysanoptera thrips plant', 'thrips damage leaf', 'трипсы на растении'],
  'Нематоды': ['plant parasitic nematode root', 'Meloidogyne root knot'],
  'Муравьи': ['garden ant pest plant', 'Lasius niger garden ant'],
  'Почковый клещ': ['Cecidophyopsis ribis', 'blackcurrant gall mite bud'],
  'Виноградная филлоксера': ['Daktulosphaira vitifoliae', 'grape phylloxera leaf root'],
};

const speciesSearchTerms: Record<string, string[]> = {
  'Яблоня': ['Malus domestica apple tree fruit', 'apple orchard fruit tree'],
  'Груша': ['Pyrus communis pear tree fruit', 'pear fruit tree garden'],
  'Вишня': ['Prunus cerasus sour cherry', 'cherry tree fruit garden'],
  'Слива': ['Prunus domestica plum tree', 'plum fruit tree garden'],
  'Черешня': ['Prunus avium sweet cherry', 'sweet cherry tree fruit'],
  'Абрикос': ['Prunus armeniaca apricot', 'apricot tree fruit garden'],
  'Персик': ['Prunus persica peach tree', 'peach fruit tree garden'],
  'Алыча': ['Prunus cerasifera cherry plum', 'cherry plum tree fruit'],
  'Виноград столовый': ['Vitis vinifera table grape', 'grape vine vineyard fruit'],
  'Виноград технический': ['Vitis vinifera wine grape', 'wine grape vine'],
  'Виноград кишмиш': ['seedless grape sultana', 'kishmish grape vine'],
  'Томат': ['Solanum lycopersicum tomato', 'tomato plant garden fruit'],
  'Огурец': ['Cucumis sativus cucumber', 'cucumber plant garden'],
  'Перец сладкий': ['Capsicum annuum bell pepper', 'sweet pepper plant garden'],
  'Баклажан': ['Solanum melongena eggplant', 'eggplant aubergine garden'],
  'Картофель': ['Solanum tuberosum potato', 'potato plant tuber garden'],
  'Морковь': ['Daucus carota carrot', 'carrot root vegetable garden'],
  'Свёкла': ['Beta vulgaris beetroot', 'beetroot garden vegetable'],
  'Капуста белокочанная': ['Brassica oleracea cabbage', 'white cabbage garden'],
  'Лук репчатый': ['Allium cepa onion', 'onion bulb garden vegetable'],
  'Чеснок': ['Allium sativum garlic', 'garlic bulb plant garden'],
  'Кабачок': ['Cucurbita pepo zucchini', 'zucchini courgette garden'],
  'Тыква': ['Cucurbita maxima pumpkin', 'pumpkin squash garden'],
  'Горох': ['Pisum sativum garden pea', 'green pea plant pod'],
  'Фасоль': ['Phaseolus vulgaris bean', 'common bean plant garden'],
  'Редис': ['Raphanus sativus radish', 'radish root vegetable garden'],
  'Клубника': ['Fragaria ananassa strawberry', 'strawberry plant garden fruit'],
  'Малина': ['Rubus idaeus raspberry', 'raspberry bush fruit garden'],
  'Ежевика': ['Rubus fruticosus blackberry', 'blackberry bush fruit'],
  'Голубика': ['Vaccinium corymbosum blueberry', 'blueberry bush fruit'],
  'Жимолость': ['Lonicera caerulea honeyberry', 'honeyberry edible blue'],
  'Смородина чёрная': ['Ribes nigrum blackcurrant', 'blackcurrant bush fruit'],
  'Смородина красная': ['Ribes rubrum redcurrant', 'redcurrant bush fruit'],
  'Крыжовник': ['Ribes uva-crispa gooseberry', 'gooseberry bush fruit'],
  'Облепиха': ['Hippophae rhamnoides sea buckthorn', 'sea buckthorn berry'],
  'Калина': ['Viburnum opulus guelder rose', 'viburnum berry fruit'],
  'Укроп': ['Anethum graveolens dill herb', 'dill herb garden'],
  'Петрушка': ['Petroselinum crispum parsley', 'parsley herb garden'],
  'Базилик': ['Ocimum basilicum basil', 'basil herb garden'],
  'Мята': ['Mentha piperita mint', 'mint herb garden plant'],
  'Кинза': ['Coriandrum sativum coriander', 'coriander cilantro herb'],
};

async function download(url: string, dest: string, redirects = 5): Promise<boolean> {
  if (redirects <= 0) return false;
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: { 'User-Agent': 'DachaCare/1.0 (garden app; contact: admin@mp24.pro)' },
      timeout: 15000,
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
        res.resume();
        download(res.headers.location, dest, redirects - 1).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(false); return; }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(true); });
      stream.on('error', () => { try { fs.unlinkSync(dest); } catch {} resolve(false); });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function searchCommonsImages(query: string, limit: number): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: query,
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '800',
    format: 'json',
    origin: '*',
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return [];

    const urls: string[] = [];
    for (const page of Object.values(pages) as any[]) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      const mime = info.mime ?? '';
      if (!mime.startsWith('image/') || mime.includes('svg') || mime.includes('gif')) continue;
      // Use thumburl (resized) and also keep full URL as fallback
      if (info.thumburl) urls.push(info.thumburl);
      else if (info.url) urls.push(info.url);
    }
    return urls;
  } catch {
    return [];
  }
}

async function seedImagesForEntity(
  entityType: string,
  searchMap: Record<string, string[]>,
  targetCount: number,
) {
  // Get all entities of this type from DB
  let entities: { id: string; name: string }[] = [];
  if (entityType === 'disease') {
    entities = await prisma.disease.findMany({ select: { id: true, name: true } });
  } else if (entityType === 'pest') {
    entities = await prisma.pest.findMany({ select: { id: true, name: true } });
  } else if (entityType === 'species') {
    entities = await prisma.plantSpecies.findMany({ select: { id: true, name: true } });
  }

  console.log(`\n  Обработка ${entityType} (${entities.length} записей)...`);

  for (const entity of entities) {
    // Check if already has enough images
    const existingCount = await prisma.image.count({
      where: { entityType, entityId: entity.id },
    });
    if (existingCount >= targetCount) {
      console.log(`    ✓ ${entity.name} — уже ${existingCount} фото`);
      continue;
    }

    const needed = targetCount - existingCount;
    const terms = searchMap[entity.name] ?? [entity.name + ' plant', entity.name];

    const allUrls = new Set<string>();
    for (const term of terms) {
      if (allUrls.size >= needed + 8) break;
      const urls = await searchCommonsImages(term, 12);
      for (const u of urls) allUrls.add(u);
      await new Promise((r) => setTimeout(r, 300));
    }

    let saved = 0;
    for (const imgUrl of allUrls) {
      if (saved >= needed) break;

      const ext = imgUrl.match(/\.(jpe?g|png|webp)/i)?.[0] ?? '.jpg';
      const filename = `${entityType}_${entity.id}_${existingCount + saved}${ext}`;
      const dest = path.join(UPLOAD_DIR, filename);

      const ok = await download(imgUrl, dest);
      if (!ok) continue;

      // Check file size > 5KB (skip tiny/broken images)
      const stat = fs.statSync(dest);
      if (stat.size < 5000) {
        fs.unlinkSync(dest);
        continue;
      }

      await prisma.image.create({
        data: {
          entityType,
          entityId: entity.id,
          filename,
          order: existingCount + saved,
        },
      });
      saved++;
    }

    console.log(`    ${saved > 0 ? '✓' : '✗'} ${entity.name} — ${saved} новых фото`);
  }
}

async function main() {
  console.log('🖼️  Загрузка изображений...\n');

  await seedImagesForEntity('species', speciesSearchTerms, 8);
  await seedImagesForEntity('disease', diseaseSearchTerms, 8);
  await seedImagesForEntity('pest', pestSearchTerms, 8);

  const total = await prisma.image.count();
  console.log(`\n✅ Всего изображений в базе: ${total}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); });
