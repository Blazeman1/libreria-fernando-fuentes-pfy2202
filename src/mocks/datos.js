// "Base de datos" del backend simulado. Solo la leen los handlers de MSW:
// el frontend nunca importa este archivo, siempre pide los datos por HTTP.

export const CATEGORIAS = [
  { slug: 'ficcion', nombre: 'Ficción', descripcion: 'Novelas que han marcado la literatura en español y del mundo.' },
  { slug: 'ciencia-ficcion', nombre: 'Ciencia ficción', descripcion: 'Futuros posibles, otros planetas y preguntas sobre la tecnología.' },
  { slug: 'fantasia', nombre: 'Fantasía', descripcion: 'Mundos imaginarios, magia y viajes de aventura.' },
  { slug: 'misterio', nombre: 'Misterio', descripcion: 'Crímenes, enigmas e investigaciones que atrapan hasta la última página.' },
  { slug: 'historia', nombre: 'Historia', descripcion: 'Ensayos para entender cómo llegamos hasta aquí.' },
  { slug: 'poesia', nombre: 'Poesía', descripcion: 'Voces fundamentales de la poesía chilena.' },
  // Sin libros a propósito: permite ver cómo responde la interfaz a una categoría vacía.
  { slug: 'drama', nombre: 'Drama', descripcion: 'Obras de teatro y textos dramáticos.' },
];

export const LIBROS = [
  { id: 'cien-anos-de-soledad', categoria: 'ficcion', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, precio: 15990,
    descripcion: 'La saga de la familia Buendía a lo largo de siete generaciones en el pueblo de Macondo.' },
  { id: 'la-casa-de-los-espiritus', categoria: 'ficcion', titulo: 'La casa de los espíritus', autor: 'Isabel Allende', anio: 1982, precio: 14990,
    descripcion: 'La historia de la familia Trueba a lo largo de cuatro generaciones en un país latinoamericano sin nombre.' },
  { id: 'los-detectives-salvajes', categoria: 'ficcion', titulo: 'Los detectives salvajes', autor: 'Roberto Bolaño', anio: 1998, precio: 18990,
    descripcion: 'Dos poetas, Arturo Belano y Ulises Lima, buscan a una poeta desaparecida en el desierto de Sonora.' },
  { id: 'rayuela', categoria: 'ficcion', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, precio: 13990,
    descripcion: 'Una novela que puede leerse en el orden habitual o saltando capítulos según un tablero de dirección.' },

  { id: 'dune', categoria: 'ciencia-ficcion', titulo: 'Dune', autor: 'Frank Herbert', anio: 1965, precio: 16990,
    descripcion: 'En el planeta desértico Arrakis, la familia Atreides se ve envuelta en la lucha por el control de la especia.' },
  { id: 'fundacion', categoria: 'ciencia-ficcion', titulo: 'Fundación', autor: 'Isaac Asimov', anio: 1951, precio: 12990,
    descripcion: 'Un matemático prevé la caída del Imperio Galáctico y traza un plan para acortar la edad oscura que vendrá.' },
  { id: 'neuromante', categoria: 'ciencia-ficcion', titulo: 'Neuromante', autor: 'William Gibson', anio: 1984, precio: 13490,
    descripcion: 'Un hacker caído en desgracia recibe una última oportunidad en una de las novelas fundadoras del ciberpunk.' },
  { id: 'la-mano-izquierda-de-la-oscuridad', categoria: 'ciencia-ficcion', titulo: 'La mano izquierda de la oscuridad', autor: 'Ursula K. Le Guin', anio: 1969, precio: 14490,
    descripcion: 'Un enviado humano llega a un planeta helado cuyos habitantes no tienen un sexo fijo.' },

  { id: 'el-hobbit', categoria: 'fantasia', titulo: 'El hobbit', autor: 'J. R. R. Tolkien', anio: 1937, precio: 12490,
    descripcion: 'Bilbo Bolsón deja la comodidad de su hogar para acompañar a trece enanos en busca de un tesoro.' },
  { id: 'un-mago-de-terramar', categoria: 'fantasia', titulo: 'Un mago de Terramar', autor: 'Ursula K. Le Guin', anio: 1968, precio: 11990,
    descripcion: 'Ged, un joven con un gran talento para la magia, debe enfrentar la sombra que él mismo liberó.' },
  { id: 'el-nombre-del-viento', categoria: 'fantasia', titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', anio: 2007, precio: 17990,
    descripcion: 'Kvothe narra su propia historia, desde su infancia en una compañía de artistas hasta su llegada a la Universidad.' },

  { id: 'el-nombre-de-la-rosa', categoria: 'misterio', titulo: 'El nombre de la rosa', autor: 'Umberto Eco', anio: 1980, precio: 15490,
    descripcion: 'Un fraile franciscano investiga una serie de muertes en una abadía del norte de Italia en 1327.' },
  { id: 'asesinato-en-el-orient-express', categoria: 'misterio', titulo: 'Asesinato en el Orient Express', autor: 'Agatha Christie', anio: 1934, precio: 10990,
    descripcion: 'Hércules Poirot investiga un asesinato cometido a bordo de un tren detenido por la nieve.' },
  { id: 'la-sombra-del-viento', categoria: 'misterio', titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', anio: 2001, precio: 14990,
    descripcion: 'En la Barcelona de posguerra, Daniel Sempere investiga el destino del autor de un libro olvidado.' },

  { id: 'sapiens', categoria: 'historia', titulo: 'Sapiens: de animales a dioses', autor: 'Yuval Noah Harari', anio: 2011, precio: 19990,
    descripcion: 'Un recorrido por la historia de la humanidad, desde la revolución cognitiva hasta la era actual.' },
  { id: 'los-canones-de-agosto', categoria: 'historia', titulo: 'Los cañones de agosto', autor: 'Barbara W. Tuchman', anio: 1962, precio: 17490,
    descripcion: 'El primer mes de la Primera Guerra Mundial y las decisiones que lo desencadenaron.' },
  { id: 'historia-de-chile-1808-1994', categoria: 'historia', titulo: 'Historia de Chile 1808-1994', autor: 'Simon Collier y William F. Sater', anio: 1996, precio: 21990,
    descripcion: 'Un panorama de la historia política, económica y social de Chile desde la independencia hasta 1994.' },

  { id: 'desolacion', categoria: 'poesia', titulo: 'Desolación', autor: 'Gabriela Mistral', anio: 1922, precio: 9990,
    descripcion: 'El primer libro de poemas de Gabriela Mistral, publicado en Nueva York en 1922.' },
  { id: 'veinte-poemas-de-amor', categoria: 'poesia', titulo: 'Veinte poemas de amor y una canción desesperada', autor: 'Pablo Neruda', anio: 1924, precio: 8990,
    descripcion: 'El poemario de juventud de Pablo Neruda, uno de los libros de poesía más leídos en español.' },
  { id: 'altazor', categoria: 'poesia', titulo: 'Altazor', autor: 'Vicente Huidobro', anio: 1931, precio: 9490,
    descripcion: 'Poema extenso de Vicente Huidobro, figura central del creacionismo.' },
];
