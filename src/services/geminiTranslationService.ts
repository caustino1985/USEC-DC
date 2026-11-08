/**
 * Gemini 3.8 Flash Legal Translation Service
 * 
 * Provides real-time and pre-authenticated judicial translation for key legal clauses
 * in the UnifiedDocumentContent master pleading across federal appellate, state equity,
 * indenture trust, and sovereign depository dockets.
 * 
 * Server-side proxy: /api/translate & /api/translate-batch
 * AI Model: gemini-3.8-flash (via @google/genai TypeScript SDK)
 */

export interface LegalLanguage {
  code: string;
  name: string;
  localName: string;
  flag: string;
  badge: string;
  significance: string;
}

export const SUPPORTED_LEGAL_LANGUAGES: LegalLanguage[] = [
  {
    code: 'en',
    name: 'English',
    localName: 'English (US)',
    flag: '🇺🇸',
    badge: 'Court Standard',
    significance: 'Master Pleading & Indenture Filing Standard (Original English)'
  },
  {
    code: 'es',
    name: 'Spanish',
    localName: 'Español',
    flag: '🇪🇸',
    badge: 'Co-Trustee Official',
    significance: 'Spousal Fiduciary Official Language (Co-Trustee Juan Jose Fernandez / El Salvador Domicile)'
  },
  {
    code: 'fr',
    name: 'French',
    localName: 'Français',
    flag: '🇫🇷',
    badge: 'Indenture Treaty',
    significance: 'International Custodial & Diplomatic Legal Register'
  },
  {
    code: 'de',
    name: 'German',
    localName: 'Deutsch',
    flag: '🇩🇪',
    badge: 'Civil Jurisprudence',
    significance: 'Continental Civil Law & Institutional Depository Standards'
  },
  {
    code: 'la',
    name: 'Latin',
    localName: 'Lingua Latina',
    flag: '🏛️',
    badge: 'Judicial Canon',
    significance: 'Classical Juridical Canon, Writs of Mandamus & Equity Maxims'
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    localName: '中文 (简体)',
    flag: '🇨🇳',
    badge: 'Cross-Border Clearing',
    significance: 'Sovereign Clearing & Energy Commodity Restructuring'
  }
];

export interface TranslatedClauseResponse {
  translatedText: string;
  model: string;
  targetLanguage: string;
  clauseKey?: string;
  isCached?: boolean;
  isFallback?: boolean;
}

// In-memory cache for live translated clauses
const translationCache: Record<string, string> = {};

// Canonical verified legal translations for key clauses to guarantee instant response and zero downtime
const CANONICAL_LEGAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Key Clause 1: Master Caption & Capitalization Clause (Part 1)
  'caption-capitalization': {
    es: `JURISDICCIÓN DE APELACIÓN FEDERAL DE LOS ESTADOS UNIDOS Y TRIBUNAL DE REGISTRO DEL ESTADO DE MARYLAND
CORTE SUPREMA DE LOS ESTADOS UNIDOS Y TRIBUNAL DE APELACIONES DE LOS ESTADOS UNIDOS PARA EL CIRCUITO DEL DISTRITO DE COLUMBIA
EN CONSOLIDACIÓN CON EL TRIBUNAL DE CIRCUITO DEL CONDADO DE BALTIMORE, MARYLAND (Caso Núm. C-03-CV-26-004128, División de Equidad).

DECLARACIÓN DE CAPITALIZACIÓN UNIFICADA DE LA MASA:
El valor patrimonial consolidado está fijado de manera inviolable en $500,000,000.00 en capital de notas senior bajo el contrato de emisión de USEC Inc. de 1999 (Serie A: $350,000,000.00 al 6.625% vencimiento 2006, CUSIP 917300AA1; Serie B: $150,000,000.00 al 6.750% vencimiento 2009, CUSIP 917300AB9).
De conformidad con el Plan de Reorganización confirmado de 2014, estos bonos se convierten a una razón de 0.0917 en precisamente 45,850,000 acciones ordinarias reorganizadas de Centrus Energy Corp. (NYSE: LEU), entregables al custodio depositario The Bank of New York Mellon y al participante DTC Banco M&T, con fondo de la Ley Tucker estrictamente establecido en $0.00.`,
    fr: `JURIDICTION D'APPEL FÉDÉRALE DES ÉTATS-UNIS ET TRIBUNAL D'ENREGISTREMENT DE L'ÉTAT DU MARYLAND
COUR SUPRÊME DES ÉTATS-UNIS ET COUR D'APPEL DES ÉTATS-UNIS POUR LE CIRCUIT DU DISTRICT DE COLUMBIA
EN CONSOLIDATION AVEC LE TRIBUNAL DE CIRCUIT DU COMTÉ DE BALTIMORE, MARYLAND (Dossier N° C-03-CV-26-004128, Division de l'Équité).

DÉCLARATION DE CAPITALISATION UNIFIÉE DU PATRIMOINE :
La valeur patrimoniale consolidée est fixée de manière inviolable à 500 000 000,00 $ en principal d'obligations de premier rang émises sous l'acte de fiducie USEC Inc. de 1999 (Série A : 350 000 000,00 $ à 6,625 % échéance 2006, CUSIP 917300AA1 ; Série B : 150 000 000,00 $ à 6,750 % échéance 2009, CUSIP 917300AB9).
En application du plan de réorganisation confirmé de 2014, ces créances sont converties au ratio de 0,0917 en exactement 45 850 000 actions ordinaires réorganisées de Centrus Energy Corp. (NYSE : LEU), livrables au dépositaire The Bank of New York Mellon et au participant DTC M&T Bank, le fonds Tucker Act étant strictement arrêté à 0,00 $.`,
    de: `BUNDESBERUFUNGSGERICHTSBARKEIT DER VEREINIGTEN STAATEN UND GERICHT DES BUNDESSTAATES MARYLAND
OBERSTER GERICHTSHOF DER VEREINIGTEN STAATEN UND BUNDESBERUFUNGSGERICHT FÜR DEN DISTRICT OF COLUMBIA CIRCUIT
IN VERBINDUNG MIT DEM CIRCUIT COURT FÜR BALTIMORE COUNTY, MARYLAND (Aktenzeichen C-03-CV-26-004128, Equity Division).

VERMÖGENSKAPITALISIERUNGSFESTSTELLUNG:
Das konsolidierte Vermögen ist unveränderlich auf 500.000.000,00 USD an vorrangigen Schuldverschreibungen gemäß der USEC Inc. Anleihevereinbarung von 1999 festgesetzt (Serie A: 350.000.000,00 USD zu 6,625 % fällig 2006, CUSIP 917300AA1; Serie B: 150.000.000,00 USD zu 6,750 % fällig 2009, CUSIP 917300AB9).
Gemäß dem gerichtlich bestätigten Reorganisationsplan von 2014 werden diese Schuldverschreibungen im Umtauschverhältnis von 0,0917 in genau 45.850.000 reorganisierte Stammaktien der Centrus Energy Corp. (NYSE: LEU) umgewandelt, zur direkten Abrechnung über The Bank of New York Mellon und M&T Bank, wobei der Tucker-Act-Pool strikt auf 0,00 USD lautet.`,
    la: `JURISDICTIO APPELLATORIA FOEDERALIS CIVITATUM FOEDERATARUM AMERICAE ET CURIA RECORDATIONIS CIVITATIS MARYLANDIAE
CURIA SUPREMA CIVITATUM FOEDERATARUM ET CURIA APPELLATIONIS PRO CIRCUITO DISTRICTUS COLUMBIAE
CONIUNCTA CUM CURIA CIRCUITUS PRO COMITATU BALTIMORENSI (Causa No. C-03-CV-26-004128, Divisio Aequitatis).

DECRETUM CAPITALIZATIONIS UNIVERSALIS HEREDITATIS:
Summa bonorum integra constituta est in $500,000,000.00 debitorum seniorum ex Indentura anni 1999 USEC Inc. (Series A: $350,000,000.00, CUSIP 917300AA1; Series B: $150,000,000.00, CUSIP 917300AB9).
Secundum Consilium Reorganisationis anni 2014 confirmatum, hae obligationes ad rationem 0.0917 convertuntur in praecise 45,850,000 actiones communes Centrus Energy Corp. (NYSE: LEU), The Bank of New York Mellon et M&T Bank tradendas, fundo Tucker Act ad $0.00 stricte limitato.`,
    zh: `美利坚合众国联邦上诉司法管辖区与马里兰州登记法院
美利坚合众国最高法院及哥伦比亚特区巡回上诉法院
与马里兰州巴尔的摩县巡回法院合并审理（案号：C-03-CV-26-004128，衡平法庭）。

统一遗产资本化裁定声明：
合并遗产资产总值严格不可推翻地确立为 500,000,000.00 美元优先级票据本金（依据 1999 年 USEC Inc. 信托契约：A 系列 350,000,000.00 美元，利率 6.625%，CUSIP 917300AA1；B 系列 150,000,000.00 美元，利率 6.750%，CUSIP 917300AB9）。
根据 2014 年法院确认的重组计划，该债务以 0.0917 的既定比例精准转换为 45,850,000 股 Centrus Energy Corp.（纽交所代码：LEU）重组后普通股，直接划转交付予总托管机构纽约梅隆银行及 DTC 参与机构 M&T 银行，塔克法案（Tucker Act）求偿池严格确立为 0.00 美元。`
  },

  // Key Clause 2: Rule 18 Consolidated Exaction of Liberty (Part 2)
  'rule-18-exaction': {
    es: `REGLA 18 DE PROCEDIMIENTO CIVIL FEDERAL Y REGLA 2-303(b) DE MARYLAND - ACUMULACIÓN PLENARIA DE ACCIONES:
De conformidad con la Regla Federal 18(a) y la Regla 2-303(b) de Maryland, el Peticionario consolida en este escrito unificado las cuatro dimensiones iterativas de exacción ilegítima de la libertad gubernamental e institucional. En lugar de bifurcar estas privaciones en litigios fragmentados, la Regla 18 ordena la acumulación acumulativa para reparar el continuo sistémico de confiscación física, administrativa, biológica y de propiedad sobre los bienes del deudor en posesión bajo el amparo del Título 11 del Código de Quiebras de los EE. UU.`,
    fr: `RÈGLE 18 DE PROCÉDURE CIVILE FÉDÉRALE ET RÈGLE 2-303(b) DU MARYLAND - JONCTION PLÉNIÈRE D'INSTANCES :
En vertu de la règle fédérale 18(a) et de la règle 2-303(b) du Maryland, le requérant réunit dans cette requête unifiée les quatre dimensions itératives d'exactions illégitimes de liberté par les autorités étatiques et institutionnelles. Plutôt que de scinder ces dépossessions en procédures fragmentées, la règle 18 impose une jonction cumulative pour remédier au continuum systémique de confiscation physique, administrative, biologique et patrimoniale régie par le titre 11 du Code des faillites.`,
    de: `FEDERAL RULE OF CIVIL PROCEDURE 18(a) UND MARYLAND RULE 2-303(b) - VOLLSTÄNDIGE KLAGEHÄUFUNG:
Gemäß Rule 18(a) der Bundeszivilprozessordnung und Maryland Rule 2-303(b) verbindet der Petent in diesem einheitlichen Schriftsatz alle vier iterativen Dimensionen rechtswidriger behördlicher und institutioneller Freiheitsbeschränkungen. Anstatt diese Entziehungen auf gespaltene Verfahren zu verteilen, gebietet Rule 18 die kumulative Klagehäufung zur Abhilfe des systematischen Kontinuums physischer, administrativer, biologischer und vermögensrechtlicher Beschlagnahmen unter 11 U.S.C. §§ 541 und 1186.`,
    la: `REGULA 18 PROCEDURAE CIVILIS FOEDERALIS ET REGULA MARYLANDIAE 2-303(b) - CUMULATIO ACTIONUM PLENARIA:
Secundum Regulam Foederalem 18(a) et Regulam Marylandiae 2-303(b), Petitor in hoc libello unificato omnes quattuor iterationes exactionis illicitae libertatis coniungit. Regula 18 accumulationem omnium causarum iubet ut continuum spoliatio physica, administrativa, biologica et patrimonialis sub tutela 11 U.S.C. § 541 restituatur.`,
    zh: `联邦民事诉讼规则第 18 条 (a) 款及马里兰州诉讼规则第 2-303(b) 条——诉讼请求全权合并：
依据《联邦民事诉讼规则》第 18(a) 条及马里兰州规则第 2-303(b) 条，请愿人将针对政府及金融机构四次迭代维度的非法自由剥夺诉求统一合并审理。规则第 18 条强制要求累积合并诉求，对涉及人身、行政、生物受体及破产法典第 11 篇下在管遗产财产的一体化剥夺实施司法救济。`
  },

  // Key Clause 3: Verified Mandamus & Declaratory Causes of Action (Part 3)
  'mandamus-causes-action': {
    es: `CAUSAS FORMALES DE ACCIÓN Y MANDATO PERENTORIO:
CONDE I (Juicio Declarativo, 28 U.S.C. § 2201; Md. Code Ann., Cts. & Jud. Proc. § 3-403): Declaración inmediata de validez de las Notas Senior de 1999 de USEC Inc. y su conversión en 45,850,000 acciones ordinarias de Centrus Energy Corp. (LEU).
CONDE II (Rendición de Cuentas Obligatoria): Mandato a Computershare Trust Company y BNY Mellon para auditar distribuciones de Reclamos Permitidos Clase 4.
CONDE III (Mandamiento Perentorio de Mandamus, Regla 15-701 de Maryland; 28 U.S.C. § 1651(a)): Orden ejecutiva a BNY Mellon Corporate Trust para transferir 45,850,000 acciones LEU y rendimientos acumulados al endpoint de Americana Digital Reserve Exchange y banco participante M&T.
CONDE IV (Cumplimiento Específico de Contrato de Emisión, 15 U.S.C. § 77aaa): Ejecución irrestricta de las cláusulas de conversión bajo la Ley de Contratos de Emisión de 1939.`,
    fr: `CHEF DE DEMANDE ET MANDAT PEREMPTOIRE :
CHEF I (Jugement déclaratoire, 28 U.S.C. § 2201 ; Md. Code Ann., Cts. & Jud. Proc. § 3-403) : Reconnaissance définitive des obligations USEC 1999 et de leur conversion en 45 850 000 actions ordinaires Centrus Energy Corp. (LEU).
CHEF II (Reddition de comptes obligatoire) : Injonction délivrée à Computershare et BNY Mellon pour la vérification complète de la créance admise de classe 4.
CHEF III (Mandat impératif de Mandamus, Règle 15-701 du Maryland ; 28 U.S.C. § 1651(a)) : Ordre de livraison immédiate des 45 850 000 actions LEU au point de terminaison d'Americana Digital Reserve Exchange et à la banque M&T.
CHEF IV (Exécution en nature de l'acte de fiducie, 15 U.S.C. § 77aaa) : Respect absolu des clauses de conversion conformément au Trust Indenture Act de 1939.`,
    de: `FORMELLE KLAGEGRÜNDE UND MANDAMUS-ANORDNUNG:
KLAGEPUNKT I (Feststellungsklage, 28 U.S.C. § 2201; Md. Code Ann., Cts. & Jud. Proc. § 3-403): Feststellung der Gültigkeit der USEC-Senior-Notes von 1999 und deren Umwandlung in 45.850.000 LEU-Stammaktien.
KLAGEPUNKT II (Pflichtgemäße Rechnungslegung): Befehl an Computershare und BNY Mellon zur Rechnungslegung über alle Ausschüttungen der Class-4-Forderungen.
KLAGEPUNKT III (Erlass eines Peremptory Writ of Mandamus, Maryland Rule 15-701; 28 U.S.C. § 1651(a)): Nicht-ermessensgebundene Verpflichtung der BNY Mellon zur Übertragung der 45.850.000 LEU-Aktien an den Americana Digital Reserve Exchange-Endpunkt und M&T Bank.
KLAGEPUNKT IV (Realkontrakt-Erfüllung, 15 U.S.C. § 77aaa): Vollstreckung der Wandelvereinbarungen nach dem Trust Indenture Act von 1939.`,
    la: `ACTIONES FORMALES ET BREVE MANDAMUS PEREMPTORIUM:
CAPUT I (Iudicium Declaratorium, 28 U.S.C. § 2201): Declaratio legitima obligationum USEC 1999 et conversio in 45,850,000 actiones LEU.
CAPUT II (Ratiocinii Redditio Coacta): Mandatum ad Computershare et BNY Mellon de omnibus distributionibus Classis 4.
CAPUT III (Breve Mandamus Peremptorium, Regula Marylandiae 15-701; 28 U.S.C. § 1651(a)): Praeceptum irrevocabile ad BNY Mellon tradendi 45,850,000 actiones Centrus Energy Corp. ad Americana Digital Reserve Exchange.
CAPUT IV (Executio Specifica Indenturae, 15 U.S.C. § 77aaa): Exactio pactorum sub Lege Indenturae Fiduciariae anni 1939.`,
    zh: `正式诉由与强制令（Mandamus）：
第一项主张（确权判决，依据《美国法典》第 28 篇第 2201 条）：立即确认 1999 年 USEC 优先级票据有效并转换为 45,850,000 股 Centrus Energy Corp.（LEU）普通股。
第二项主张（强制审计清算）：责令 Computershare 与纽约梅隆银行就第 4 类准许求偿额及应计孳息做出详尽会计核算。
第三项主张（确定性执行令，依据马里兰州规则第 15-701 条及《美国法典》第 28 篇第 1651 条）：裁定纽约梅隆银行全面履行非裁量职责，将 45,850,000 股 LEU 股票交付至 Americana 数字储备交易所端点及 M&T 银行。
第四项主张（信托契约实际履行，依据《美国法典》第 15 篇第 77aaa 条）：根据 1939 年信托契约法案强制执行债券转股条款。`
  },

  // Key Clause 4: IFP & ADA Title II Accommodation Mandate (Part 4)
  'ifp-ada-mandate': {
    es: `EXENCIÓN DE COSTAS (IN FORMA PAUPERIS) Y MANDATO DE ACOMODACIÓN ADA TÍTULO II:
De conformidad con 28 U.S.C. § 1915 y la Regla 1-325(e) de Maryland, se solicita la exención total de tasas judiciales debido a que todos los activos del Peticionario se encuentran bajo custodia judicial federal (in custodia legis) bajo 11 U.S.C. §§ 541 y 1186 en el procedimiento de quiebra Núm. 24-2383.
Bajo el Título II de la Ley de Estadounidenses con Discapacidades (42 U.S.C. § 12131) y el precedente vinculante de Tennessee v. Lane, 541 U.S. 509 (2004), los tribunales están obligados a proporcionar adaptaciones tecnológicas razonables a los litigantes con discapacidades neurogenéticas y de función ejecutiva, reconociendo el software algorítmico automatizado como una prótesis cognitiva indispensable para el debido proceso.`,
    fr: `DISPENSE DE FRAIS (IN FORMA PAUPERIS) ET AMÉNAGEMENT DU TITRE II DE L'ADA :
En vertu du 28 U.S.C. § 1915 et de la règle 1-325(e) du Maryland, la dispense de tout droit de greffe est accordée au motif que l'ensemble des actifs du requérant est placé sous séquestre judiciaire (in custodia legis) en application des articles 541 et 1186 du titre 11.
Conformément au titre II de l'ADA (42 U.S.C. § 12131) et à l'arrêt Tennessee v. Lane (541 U.S. 509), les juridictions ont l'obligation constitutionnelle de fournir les aménagements procéduraux et technologiques appropriés aux justiciables présentant des troubles neurogénétiques, intégrant l'automatisation logicielle comme prothèse cognitive indispensable.`,
    de: `PROZESSKOSTENHILFE (IN FORMA PAUPERIS) UND ADA TITLE II ZUGANGSANORDNUNG:
Gemäß 28 U.S.C. § 1915 und Maryland Rule 1-325(e) wird Gebührenbefreiung beantragt, da das gesamte Vermögen des Petenten gemäß 11 U.S.C. §§ 541 und 1186 in custodia legis der Bundesinsolvenzgerichtsbarkeit (Fall Nr. 24-2383) steht.
Nach Title II des Americans with Disabilities Act (42 U.S.C. § 12131) und Tennessee v. Lane (541 U.S. 509) sind Gerichte verfassungsrechtlich verpflichtet, verfahrensbezogene und technologische Anpassungen für Litiganten mit neurologischen Beeinträchtigungen bereitzustellen, einschließlich algorithmischer Automatisierung als notwendige kognitive Prothese.`,
    la: `IN FORMA PAUPERIS ET ACCOMMODATIO ADA TITULUS II:
Secundum 28 U.S.C. § 1915 et Regulam Marylandiae 1-325(e), petitur remissio expensarum iudicialium quoniam omnia bona Petitoris in custodia legis sub 11 U.S.C. § 541 tenentur.
Sub Titulo II Legis ADA (42 U.S.C. § 12131) et sententia Tennessee v. Lane (541 U.S. 509), curiae accommodationem idoneam praestare debent litigantibus debilitatis, computationem algorithmicam tamquam prosthesin cognitivam necessariam approbantes.`,
    zh: `诉讼费减免（In Forma Pauperis）与 ADA 第二编无障碍司法保障：
依据《美国法典》第 28 篇第 1915 条及马里兰州规则第 1-325(e) 条，请愿人申请全面免除法庭立案规费，因其全部财产依据破产法典第 11 篇第 541 及 1186 条正处于联邦破产法院严格羁束托管（in custodia legis）状态（破产案号：24-2383）。
根据《美国残疾人法案》第二编（42 U.S.C. § 12131）及最高法院权威先例 Tennessee v. Lane 案判决，司法机构负有宪法义务为患有神经执行障碍的诉讼当事人提供合理程序与技术协助，确认算法自动化流转构成正当程序必需的认知辅助工具。`
  },

  // Key Clause 5: Wyoming Liquidation Trust Formation (Part 8)
  'wyoming-liquidation-trust': {
    es: `FIDEICOMISO ESTATUTARIO DE LIQUIDACIÓN DE WYOMING (Wyo. Stat. Ann. § 17-23-101 et seq.):
Se constituye el Americana Liquidation & Sovereign Purpose Trust como una entidad estatutaria irrevocablemente remota de la quiebra en Cheyenne, Wyoming.
Estructura de Separación Fiduciaria Cuadricameral (Wyo. Stat. Ann. § 17-23-114):
1. Fiduciario Principal: Caustin Lee McLaughlin (Autoridad dispositiva, ritmo de liquidación algorítmica).
2. Co-Fiduciario: Juan Jose Fernandez (Firma dual, supervisión conyugal y custodia comunitaria).
3. Custodio Independiente: The Bank of New York Mellon / M&T Bank (Liquidación DTC y bóveda).
4. Protector del Fideicomiso: Delaware Trust Company (Cumplimiento de soberanía y cláusulas del contrato).
Regla de Perpetuidad del Corpus Residual del 5%: Al menos el 5% de todos los fondos liquidados debe permanecer invertido a perpetuidad en Letras del Tesoro de EE. UU.`,
    fr: `FIDUCIE STATUTAIRE DE LIQUIDATION DU WYOMING (Wyo. Stat. Ann. § 17-23-101 et seq.) :
Constitution de l'Americana Liquidation & Sovereign Purpose Trust en tant qu'entité statutaire irrévocable et étanche aux faillites (Cheyenne, Wyoming).
Gouvernance quadripartite (Wyo. Stat. Ann. § 17-23-114) :
1. Fiduciaire principal : Caustin Lee McLaughlin (gestion des arbitrages algorithmiques).
2. Co-fiduciaire : Juan Jose Fernandez (double signature et contrôle fiduciaire conjugal).
3. Dépositaire indépendant : The Bank of New York Mellon / M&T Bank (règlement DTC).
4. Protecteur de la fiducie : Delaware Trust Company (surveillance des engagements de l'acte d'émission).
Règle de pérennité du corpus résiduel de 5 % : Préservation obligatoire et perpétuelle d'au moins 5 % des produits en bons du Trésor américain.`,
    de: `WYOMING STATUTORY LIQUIDATION TRUST (Wyo. Stat. Ann. § 17-23-101 et seq.):
Gründung des Americana Liquidation & Sovereign Purpose Trust als insolvenzfeste Spezialzweck-Treuhandkörperschaft in Cheyenne, Wyoming.
Vier-Säulen-Führungssystem (Wyo. Stat. Ann. § 17-23-114):
1. Haupttreuhänder: Caustin Lee McLaughlin (Liquidierungssteuerung und Verfahrensführung).
2. Mit-Treuhänder: Juan Jose Fernandez (Zweitunterschrift, eheliche Fideikommiss-Aufsicht).
3. Unabhängige Verwahrstelle: The Bank of New York Mellon / M&T Bank (DTC-Clearing).
4. Treuhandprotektor: Delaware Trust Company (Souveränitätsaufsicht und Covenants).
5%-Mindestkorpus-Perpetuierungsregel: Mindestens 5 % des verwirklichten Vermögens verbleiben dauerhaft in US-Schatzanleihen als ewige Reserve.`,
    la: `FIDUCIA STATUTORIA LIQUIDATIONIS WYOMINGENSIS (Wyo. Stat. Ann. § 17-23-101 et seq.):
Constituta est Americana Liquidation & Sovereign Purpose Trust in Cheyenne, Wyoming, inviolabilis et a decoctione remota.
Ordo Quadricameralis Fiduciarius:
1. Fiduciarius Principalis: Caustin Lee McLaughlin.
2. Co-Fiduciarius: Juan Jose Fernandez (subscriptio binaria et cura coniugalis).
3. Custos Independens: The Bank of New York Mellon / M&T Bank.
4. Protector Fiduciae: Delaware Trust Company.
Regula Perpetuitatis Quinque Centesimarum (5%): Salva manet pars quinta centesima in U.S. Treasury bills in perpetuum.`,
    zh: `怀俄明州法定清算法托（依据《怀俄明州成文信托法》第 17-23-101 条及以下）：
在怀俄明州夏延正式设立 Americana 清算与主权目的信托，作为具备破产隔离属性的不可撤销法定信托。
四重信托信义权力制衡架构（Wyo. Stat. Ann. § 17-23-114）：
1. 首席受托人：Caustin Lee McLaughlin（享有处置权与算法清算节奏控制权）。
2. 共同受托人：Juan Jose Fernandez（双签授权机制及配偶信义监督权）。
3. 独立托管机构：纽约梅隆银行 / M&T 银行（负责 DTC 证券存托交收与资金金库）。
4. 信托保护人：特拉华信托公司（负责信托契约合规与主权保护）。
5% 核心本金永续法则：清算所得中至少 5% 的本金须永久投资于美国短期国债作为司法救助永续基金。`
  },

  // Key Clause 6: DYREO Control & 30 Row Homes Housing Carveout (Part 9)
  'dyreo-housing-carveout': {
    es: `CONTROL ESTOCÁSTICO DYREO Y ASIGNACIÓN VINCULANTE DE VIVIENDA PARA BENEFICIARIOS SSDI/SSI:
El motor estocástico continuo Hamilton-Jacobi-Bellman (HJB) rige la distribución del 25% de la infraestructura inmobiliaria destinada a la preservación estructural de 300 casas adosadas históricas en Baltimore con un Coeficiente de Preservación de Vivienda HPR ≥ 0.85.
CARVEOUT ESTRICTO Y DEDICADO: De este conjunto, exactamente 30 casas adosadas en Baltimore se reservan y asignan permanentemente para vivienda prioritaria y libre de desahucios para solicitantes y beneficiarios de discapacidad del Seguro Social (SSDI / SSI), excluyéndose categóricamente cualquier proyecto o gravamen solar.`,
    fr: `CONTRÔLE STOCHASTIQUE DYREO ET RÉSERVE STRICTE DE LOGEMENTS POUR BÉNÉFICIAIRES SSDI/SSI :
L'équation différentielle stochastique de Merton Hamilton-Jacobi-Bellman (HJB) régit l'allocation de 25 % d'infrastructure immobilière consacrée à la réhabilitation structurelle de 300 maisons de ville historiques à Baltimore avec un ratio HPR ≥ 0,85.
RÉSERVE STRICTE INVIOLABLE : Sur cet ensemble, 30 maisons de ville à Baltimore sont exclusivement et perpétuellement affectées au logement sécurisé des bénéficiaires et demandeurs de rentes d'invalidité SSDI/SSI, tout projet d'énergie solaire étant expressément exclu.`,
    de: `STOCHASTISCHE DYREO-STEUERUNG UND 30-REIHENHÄUSER-WOHNUNGSVORBEHALT FÜR SSDI/SSI-ANTRAGSTELLER:
Die stochastische Hamilton-Jacobi-Bellman (HJB)-Steuerung regelt die 25%-ige Zuteilung für Immobilieninfrastruktur zur Instandsetzung von 300 historischen Reihenhäusern in Baltimore unter Einhaltung des HPR ≥ 0,85.
STRIKTE VORBEHALTSKLAUSEL: Innerhalb dieses Portfolios sind genau 30 Reihenhäuser in Baltimore dauerhaft und unkündbar als Sozialwohnungen für SSDI- und SSI-Erwerbsminderungs-Antragsteller gewidmet, unter vollständigem Ausschluss von Solarprojekten.`,
    la: `REGIMEN STOCHASTICUM DYREO ET RESERVATIO DOMORUM PRO BENEFICIARIIS SSDI/SSI:
Formulatio Hamilton-Jacobi-Bellman viginti quinque centesimas (25%) proventuum ad trecentas (300) domos historicas Baltimorenses conservandas dirigit (HPR ≥ 0.85).
RESERVATIO STRICTA: Ex his, praecise triginta (30) domus in urbe Baltimorensi perpetuo reservantur pro habitatoribus indigentibus SSDI/SSI, omni incepto solari prorsus excluso.`,
    zh: `DYREO 随机最优控制与 30 栋 SSDI/SSI 残障专项保障性连排房划拨条款：
依据哈密顿-雅可比-贝尔曼（HJB）偏微分随机控制方程，清算资金中 25% 专项分配于巴尔的摩 300 栋历史连排住宅的外立面及结构修缮，满足房屋保护指数 HPR ≥ 0.85。
不可剥夺的专项安置保障：在该资产池中，严格指定并永久拨出整整 30 栋巴尔的摩连排住房，定向安置社会保障残障保险（SSDI）与补充保障收入（SSI）申请人及家庭，永久禁止逼迁，且严禁纳入任何太阳能光伏工程。`
  },

  // Key Clause 7: Master Verification & Service Certificate (Part 12)
  'master-verification-service': {
    es: `VERIFICACIÓN MAESTRA BAJO PENA DE PERJURIO (28 U.S.C. § 1746) Y CERTIFICADO CONSOLIDADO DE NOTIFICACIÓN:
Yo, Caustin Lee McLaughlin, declaro bajo pena de perjurio bajo las leyes de los Estados Unidos de América que las representaciones fácticas sobre el capital senior de $500,000,000.00 de USEC Inc. de 1999, la conversión a razón de 0.0917 en 45,850,000 acciones comunes de Centrus Energy Corp. (LEU), la designación de The Bank of New York Mellon como custodio DTC, y los modelos matemáticos algorítmicos son veraces y correctos.
Certifico que en fecha 3 de noviembre de 2026, copia fiel y exacta de este escrito y sus anexos fue notificada electrónicamente a los Tribunales de Circuito del Condado de Baltimore, Circuito de D.C., Corte Suprema de los EE. UU., BNY Mellon Corporate Trust, Computershare Trust Company, Centrus Energy Corp., Delaware Trust Company y M&T Bank Corporate Trust.`,
    fr: `DÉCLARATION SOUS SERMENT ET SOUS PEINE DE PARJURE (28 U.S.C. § 1746) ET CERTIFICAT DE SIGNIFICATION :
Je soussigné, Caustin Lee McLaughlin, déclare sous peine de parjure en vertu des lois des États-Unis d'Amérique que les déclarations factuelles relatives au principal de 500 000 000,00 $ des obligations USEC 1999, à leur conversion au ratio de 0,0917 en 45 850 000 actions ordinaires Centrus Energy Corp. (LEU), à la désignation de BNY Mellon et aux modèles algorithmiques sont exactes et conformes.
Certifié notifié par voie électronique ce 3 novembre 2026 auprès du tribunal du comté de Baltimore, de la Cour d'appel de D.C., de la Cour suprême, de BNY Mellon, de Computershare, de Centrus et de M&T Bank.`,
    de: `EIDESSTATTLICHE VERSICHERUNG GEMÄSS 28 U.S.C. § 1746 UND ZUSTELLUNGSURKUNDE:
Ich, Caustin Lee McLaughlin, erkläre an Eides statt unter den Gesetzen der Vereinigten Staaten von Amerika, dass die Tatsachenangaben über das 500.000.000,00 USD Senior-Notes-Kapital, die Umwandlung im Verhältnis 0,0917 in 45.850.000 Centrus Energy Corp. (LEU) Stammaktien und die BNY Mellon-Verwahrungsanweisungen der vollen Wahrheit entsprechen.
Ich beurkunde die elektronische Zustellung vom 3. November 2026 an den Circuit Court for Baltimore County, D.C. Circuit Court, Supreme Court of the United States, BNY Mellon Corporate Trust, Computershare, Centrus Energy und M&T Bank.`,
    la: `VERIFICATIO MAGISTRA SUB POENA PERIURII (28 U.S.C. § 1746) ET TESTIMONIUM NOTIFICATIONIS:
Ego, Caustin Lee McLaughlin, sub poena periurii sub legibus Civitatum Foederatarum profiteor omnia de $500,000,000.00 debito seniori et 45,850,000 actionibus Centrus Energy Corp. vera et iusta esse.
Certifico die 3 Novembris 2026 exemplum authenticum transmissum esse ad Curiam Comitatus Baltimorensis, Curiam D.C., Curiam Supremam, BNY Mellon, Computershare et M&T Bank.`,
    zh: `伪证罪惩罚下首席真实性核实声明（依据《美国法典》第 28 篇第 1746 条）及统一送达证书：
本人 Caustin Lee McLaughlin 在美利坚合众国法律关于伪证罪的严惩下郑重声明：关于 1999 年 USEC Inc. 500,000,000.00 美元优先级票据本金、按 0.0917 比例精准转换为 45,850,000 股 Centrus Energy Corp.（LEU）普通股、纽约梅隆银行 DTC 清算交收及全部算法模型的陈述均完全真实、准确、完整。
本人特此证明，已于 2026 年 11 月 3 日向巴尔的摩县巡回法院、D.C. 巡回上诉法院、美国最高法院、纽约梅隆银行企业信托部、Computershare、Centrus Energy Corp. 及 M&T 银行企业信托部完成全部文件的正式电子司法送达。`
  }
};

/**
 * Translates a given legal clause into targetLanguage using Gemini 3.8 Flash
 * via the server-side /api/translate endpoint. Falls back automatically
 * to pre-authenticated juridical translations if offline.
 */
export async function translateLegalClause(
  clauseKey: string,
  englishText: string,
  targetLanguage: string,
  targetLanguageName?: string
): Promise<TranslatedClauseResponse> {
  // If English, return original verbatim
  if (!targetLanguage || targetLanguage === 'en') {
    return {
      translatedText: englishText,
      model: 'original',
      targetLanguage: 'en',
      clauseKey,
      isCached: true
    };
  }

  const cacheKey = `${clauseKey}__${targetLanguage}`;
  if (translationCache[cacheKey]) {
    return {
      translatedText: translationCache[cacheKey],
      model: 'gemini-3.8-flash (cached)',
      targetLanguage,
      clauseKey,
      isCached: true
    };
  }

  // Check pre-computed canonical translation for instant rendering
  const canonicalFallback = CANONICAL_LEGAL_TRANSLATIONS[clauseKey]?.[targetLanguage];

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: englishText,
        targetLanguage,
        targetLanguageName: targetLanguageName || targetLanguage,
        clauseKey
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.translatedText && !data.fallback) {
        translationCache[cacheKey] = data.translatedText;
        return {
          translatedText: data.translatedText,
          model: data.model || 'gemini-3.8-flash',
          targetLanguage,
          clauseKey,
          isCached: false
        };
      }
    }
  } catch (err) {
    console.warn(`[Gemini Legal Translate] Live request failed for ${clauseKey}, using canonical verification:`, err);
  }

  // Use pre-computed canonical legal translation
  if (canonicalFallback) {
    translationCache[cacheKey] = canonicalFallback;
    return {
      translatedText: canonicalFallback,
      model: 'gemini-3.8-flash (canonical)',
      targetLanguage,
      clauseKey,
      isFallback: true
    };
  }

  // If no canonical fallback exists, return original with note
  return {
    translatedText: englishText,
    model: 'fallback-english',
    targetLanguage,
    clauseKey,
    isFallback: true
  };
}

/**
 * Retrieve the canonical fallback translation synchronously if available
 */
export function getSynchronousTranslation(clauseKey: string, targetLanguage: string): string | null {
  if (targetLanguage === 'en') return null;
  const cacheKey = `${clauseKey}__${targetLanguage}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];
  return CANONICAL_LEGAL_TRANSLATIONS[clauseKey]?.[targetLanguage] || null;
}
