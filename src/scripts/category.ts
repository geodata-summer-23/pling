import { $t } from '@/translation'
// import compassSvgSrc from '@/assets/compass.svg'

export type Category =
  | 'flood'
  | 'rainFlood'
  | 'temperature'
  | 'katabaticWind'
  | 'quickClay'
  | 'stormSurge'
  | 'seaRise'
  | 'metAlerts'
  | 'other'

export const allCategories: Category[] = [
  'flood',
  'rainFlood',
  'temperature',
  'katabaticWind',
  'quickClay',
  'stormSurge',
  'seaRise',
]

export enum Severity {
  Unknown,
  NoDanger,
  Moderate,
  Critical,
}

const severityColors = {
  [Severity.Unknown]: 'yellow',
  [Severity.NoDanger]: 'yellow',
  [Severity.Moderate]: 'orange',
  [Severity.Critical]: 'red',
}
export const getCategoryIconSrc = (
  category: Category,
  severity: Severity = Severity.Unknown
) => {
  const color = severityColors[severity] ?? severityColors[Severity.Unknown]

  switch (category) {
    case 'katabaticWind':
      return `./warningIcons/icon-warning-wind-${color}.svg`
    case 'temperature':
    case 'quickClay':
    case 'seaRise':
    case 'other':
      return `./warningIcons/icon-warning-generic-${color}.svg`
    default:
      return `./warningIcons/icon-warning-${category.toLowerCase()}-${color}.svg`
  }
}
export type FeatureLayerUrls = Record<string, { url: string; radius: number }>
export type CategoryOption = {
  title: string
  layerId: string
  category: Category
  faIcon: string
  featureLayers: FeatureLayerUrls
  info: {
    description: string
    img?: string
    legends: {
      title: string
      items: {
        text: string
        color: string
        shape?: 'circle' | 'arrow' | 'line' | 'square'
      }[]
    }[]
  }
}

export const getCategoryOptions = (): CategoryOption[] => [
  {
    title: $t().rainFlood,
    layerId: '1894a0de007-layer-22',
    category: 'rainFlood',
    faIcon: 'cloud-showers-heavy',
    featureLayers: {
      buildings: {
        url: 'https://utility.arcgis.com/usrsvcs/servers/5ba98478f7bd4abf9ffb28797f391d26/rest/services/Geomap_UTM33_EUREF89/GeomapGRIP/MapServer/1',
        radius: 0,
      },
    },
    info: {
      description: `Styrtregn er intense regnbyger over en kort tidsperiode, gjerne helt lokalt.<br/><br/>Her; kun fargelagt på bygninger med kjeller ettersom de er spesielt utsatt.`,
      legends: [
        {
          title: 'Vannveier',
          items: [
            {
              text: 'Vannveier',
              color: '#295FBF',
              shape: 'line',
            },
            {
              text: 'Piler indikerer vannets retning',
              color: '#295FBF',
              shape: 'arrow',
            },
          ],
        },
        {
          title: 'Utsatte bygninger for overvann',
          items: [
            {
              text: 'Svært stor vannvei nær bygning',
              color: '#DB645D',
            },
            {
              text: 'Stor vannvei nær bygning',
              color: '#F2AC77',
            },
            {
              text: 'Medium vannvei nær bygning',
              color: '#F8D990',
            },
            {
              text: 'Liten vannvei nær bygning',
              color: '#E0E5B8',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().flood,
    layerId: '1894e6f75c8-layer-27',
    category: 'flood',
    faIcon: 'water',
    featureLayers: {
      // TODO
      // flood: {
      //   url: 'https://utility.arcgis.com/usrsvcs/servers/811c02c15905411d89f2a6e3bcda6399/rest/services/Geomap_UTM33_EUREF89/GeomapFlom/MapServer/1',
      //   radius: 50,
      // },
    },
    info: {
      description: `Flom er oversvømmelse ved økt vannstand i elver, som følge av mye regn og/eller snøsmelting.<br/><br/>Her; Områder som kan bli under vann hvis en stor flom oppstår. Det er stor sannsynlighet for at en flom av denne størrelsen kommer til å skje i løpet av de neste 20 årene. `,
      legends: [
        {
          title: 'Flomsone',
          items: [
            {
              text: 'Områder som kan bli oversvømt',
              color: '#99B8E7',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().temperatureMap,
    layerId: '18963742ade-layer-39',
    category: 'temperature',
    faIcon: 'temperature-high',
    featureLayers: {
      temperature: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Temperatur_Hele/FeatureServer',
        radius: 50,
      },
    },
    info: {
      description: `Temperaturkartet viser variasjoner i temperatur på en solfylt dag. Områder med tett bebyggelse vil vanligvis skape høyere temperaturer enn områder med mye grøntareal.`,
      legends: [
        {
          title: 'Temperaturforskjeller',
          items: [
            {
              text: 'Varmeste områder',
              color: '#EA8B80',
            },
            {
              text: 'Varme områder',
              color: '#F3C99B',
            },
            {
              text: 'Gjennomsnittlig temperatur',
              color: '#FCFEDE',
            },
            {
              text: 'Kjølige områder',
              color: '#D1E1CE',
            },
            {
              text: 'Kjøligste områder',
              color: '#9CC4E1',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().katabaticWind,
    layerId: '1894ed8aeb4-layer-32',
    category: 'katabaticWind',
    faIcon: 'wind',
    featureLayers: {
      buildings: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Usatte%20Bygg%20Alle/FeatureServer',
        radius: 0,
      },
      south: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Sordavind_Polygon/FeatureServer',
        radius: 50,
      },
      north: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Nordavind_Polygon/FeatureServer',
        radius: 50,
      },
      east: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Vest_minus_ost/FeatureServer',
        radius: 50,
      },
      west: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Ost_minus_vest/FeatureServer',
        radius: 50,
      },
    },
    info: {
      description: `Fallvind betegnes som sterk og turbulent vind som kan oppstå når luft beveger seg nedover en br/att skråning.<br/><br/>Her; Områder som er utsatt for kraftige vindkast fra fallvind basert på vindretning.`,
      // img: compassSvgSrc,
      legends: [
        {
          title: 'Områder utsatt for fallvind, med retning',
          items: [
            {
              text: 'Nordavind',
              color: '#4C81CD',
            },
            {
              text: 'Østavind',
              color: '#F0F0A6',
            },
            {
              text: 'Søravind',
              color: '#E9A292',
            },
            {
              text: 'Vestavind',
              color: '#B4D49D',
            },
          ],
        },
        {
          title: 'Bygg utsatt for fallvind',
          items: [
            {
              text: 'Utsatte bygg',
              color: '#E5685E',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().quickClay,
    layerId: '1894e91ecbb-layer-30',
    category: 'quickClay',
    faIcon: 'hill-rockslide',
    featureLayers: {
      // TODO
      // quickClay: {
      //   url: 'https://utility.arcgis.com/usrsvcs/servers/ec96f664795c4ff4843ee086069bb7ab/rest/services/Geomap_UTM33_EUREF89/GeomapSkred/MapServer/21',
      //   radius: 50,
      // },
    },
    info: {
      description: `Kvikkleire er betegnelsen på marinleire som ved overbelastning kan bli tyntflytende og skape kollaps. Overbelasting kan eksempelvis oppstå ved bygningsarbeid og kraftig regn.<br/><br/>Her; Områder utsatt for kvikkleireskred`,
      legends: [
        {
          title: 'Kvikkleirerisiko',
          items: [
            {
              text: 'Høy risiko',
              color: '#FE1115',
              shape: 'square',
            },
            {
              text: 'Middels risiko',
              color: '#FEA804',
              shape: 'square',
            },
            {
              text: 'Lav risiko',
              color: '#FFFE75',
              shape: 'square',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().stormSurge,
    layerId: '189639a4259-layer-40',
    category: 'stormSurge',
    faIcon: 'house-flood-water',
    featureLayers: {
      stormSurge: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Stormflo_ny/FeatureServer',
        radius: 50,
      },
    },
    info: {
      description: `Stormflo oppstår i områder som er utsatt for vanninntrenging fra havet ved storm mot land.<br/><br/>Her; Det vises områder som er utsatt for vanninntrenging fra havet ved storm mot land, det er svært stor sannsynlighet for at en slik hendelse vil skje i løpet av de neste 20 årene.`,
      legends: [
        {
          title: 'Stormflosoner',
          items: [
            {
              text: 'Områder hvor vanninntrenging kan oppstå',
              color: '#99B8E7',
            },
          ],
        },
        {
          title: 'Bygg utsatt for stormfo',
          items: [
            {
              text: 'Utsatte bygg',
              color: '#99B8E7',
            },
          ],
        },
      ],
    },
  },
  {
    title: $t().seaRise,
    layerId: '18963f12bf3-layer-42',
    category: 'seaRise',
    faIcon: 'arrow-up-from-ground-water',
    featureLayers: {
      buildings: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/bygghavniv/FeatureServer/0',
        radius: 0,
      },
      seaRise: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Havniv%C3%A5/FeatureServer/0',
        radius: 0,
      },
    },
    info: {
      description: `Havnivåstigning er en konsekvens av klimaendringer som kan føre til at dagens landområder vil havne under vann.<br/><br/>Her; bygg som vil ligge under havnivå i 2090.`,
      legends: [
        {
          title: 'Soner for havnivåstigning',
          items: [
            {
              text: 'Områder som vil ligge under havnivå i 2019',
              color: '#99B8E7',
            },
          ],
        },
        {
          title: 'Bygg utsatt for havnivåstigning',
          items: [
            {
              text: 'Bygninger som vil ligge under havnivå i 2019',
              color: '#99B8E7',
            },
          ],
        },
      ],
    },
  },
]
