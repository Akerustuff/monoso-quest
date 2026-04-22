// js/data.js

const MISIONES_DIARIAS_PERSONALES = [,
    { id: 'bañarse', nombre: 'Ritual de la Cascada Sagrada', desc: 'Bañarse', puntos: 1 },
    { id: 'desayunar', nombre: 'Sustento Matutino', desc: 'Desayunar comida casera', puntos: 1 },
    { id: 'almorzar', nombre: 'Sustento Diurno', desc: 'Almorzar comida casera', puntos: 1 },
    { id: 'cenar', nombre: 'Sustento Vespertino', desc: 'Cenar comida casera', puntos: 1 },
    { id: 'acostarse_temprano', nombre: 'Retirada al Santuario del Sueño', desc: 'Acostarse temprano (hora acordada)', puntos: 1 },
    { id: 'tomar_agua', nombre: 'Elixir de la Vitalidad Infinita', desc: 'Tomar 2 litros de agua al día', puntos: 1 },
    { id: 'ejercicio_activacion', nombre: 'Sintonía del Guerrero', desc: 'Ejercicios de activación/estiramiento (15 min)', puntos: 1 },
    { id: 'skin_care', nombre: 'Aplicación de Hechizo Protector', desc: 'Skin care diario', puntos: 1 }
];

const MISIONES_DIARIAS_HOGAR = [
    { id: 'tender_cama', nombre: 'Levantar el Campamento', desc: 'Tender la cama', puntos: 2 },
    { id: 'lavar_platos', nombre: 'Purificación de Cristal', desc: 'Lavar platos', puntos: 2 },
    { id: 'secar_platos', nombre: 'Almacenamiento de Cristal', desc: 'Secar platos', puntos: 2 },
    { id: 'vasos_alacena', nombre: 'El Sereno del Cristal', desc: 'Dejar todos los vasos en desuso en la alacena', puntos: 2 },
    { id: 'limpiar_mesones', nombre: 'Restauración de los Mesones', desc: 'Limpiar los mesones de la cocina', puntos: 5 },
    { id: 'ropa_del_suelo', nombre: 'El Suelo es Lava', desc: 'No dejar ropa en el suelo al final del día', puntos: 2 },
    { id: 'guardar_almuerzo', nombre: 'Preparar provisiones monunas', desc: 'Guardar el almuerzo de mono para el día siguiente', puntos: 1 }

]

const MISIONES_SEMANALES_GRUPALES = [
    {
        id: 'limpiar_habitación',
        nombre: 'Orden del Portal del Sueño',
        desc: 'Limpiar habitación',
        buff: 'Descanso del Guerrero',
        puntosBuffCompleto: 20,
        subtareas: [
            {id: 'limpiar_habitacion_superficies', nombre: 'Purificar Superficies', desc: 'Limpiar superficies de los muebles', puntos: 20},
            { id: 'limpiar_habitacion_sabanas', nombre: 'Cambio de la Seda del Descanso', desc: 'Cambiar las sábanas', puntos: 20 },
            { id: 'limpiar_habitacion_organizar', nombre: 'Alineación de los Tótems', desc: 'Organizar espacios', puntos: 20 } 
        ]
    },
    {
        id: 'limpiar_oficina_mono',
        nombre: 'Purga del Santuario Monuno',
        desc: 'Limpiar oficina de Mono',
        buff: 'Claridad Mental del Sabio Mono',
        puntosBuffCompleto: 20,
        subtareas: [
            { id: 'limpiar_oficina_mono_escritorio', nombre: 'Mantenimiento Mesa de Trabajo', desc: 'Limpiar escritorio', puntos: 20},
            { id: 'limpiar_oficina_mono_superficies', nombre: 'Purificar Superficies', desc: 'Limpiar superficies', puntos: 20 },
            { id: 'limpiar_oficina_mono_organizar', nombre: 'Organización de los Equipos', desc: 'Organizar espacios', puntos: 20 }
        ]
    },
    {
          id: 'limpiar_oficina_oso',
          nombre: 'Purga del Santuario Osuno',
          desc: 'Limpiar oficina de Oso',
          buff: 'Claridad Mental del Sabio Oso',
          puntosBuffCompleto: 20,
          subtareas: [
              { id: 'limpiar_oficina_oso_escritorio', nombre: 'Mantenimiento Mesa de Trabajo', desc: 'Limpiar escritorio', puntos: 20 },
              { id: 'limpiar_oficina_oso_superficies', nombre: 'Purificar Superficies', desc: 'Limpiar superficies', puntos: 20 },
              { id: 'limpiar_oficina_oso_organizar', nombre: 'Organización de los Equipos', desc: 'Organizar espacios', puntos: 20 }
          ]
      },
      {
          id: 'limpiar_bano_principal',
          nombre: 'Restauración de la Cascada Mayor',
          desc: 'Limpiar baño principal',
          buff: 'Purificación Total Mayor',
          puntosBuffCompleto: 20,
          subtareas: [
              { id: 'limpiar_bano_principal_espejo', nombre: 'Purificación del Cristal', desc: 'Limpiar espejo', puntos: 20 },
              { id: 'limpiar_bano_principal_banera', nombre: 'Exorcismo de la Laguna de Cristal', desc: 'Limpiar bañera', puntos: 20 },
              { id: 'limpiar_bano_principal_inodoro', nombre: 'Purificación del Trono de Piedra', desc: 'Limpiar inodoro', puntos: 20 },
              { id: 'limpiar_bano_principal_lavamanos', nombre: 'Pulido del Manantial del Alba', desc: 'Limpiar lavamanos', puntos: 20 }
          ]
      },
      {
          id: 'limpiar_bano_secundario',
          nombre: 'Restauración de la Cascada Menor',
          desc: 'Limpiar baño secundario',
          buff: 'Purificación Total Menor',
          puntosBuffCompleto: 20,
          subtareas: [
              { id: 'limpiar_bano_secundario_espejo', nombre: 'Purificación del Cristal', desc: 'Limpiar espejo', puntos: 20 },
              { id: 'limpiar_bano_secundario_banera', nombre: 'Exorcismo de la Laguna de Cristal', desc: 'Limpiar bañera', puntos: 20 },
              { id: 'limpiar_bano_secundario_inodoro', nombre: 'Purificación del Trono de Piedra', desc: 'Limpiar inodoro', puntos: 20 },
              { id: 'limpiar_bano_secundario_lavamanos', nombre: 'Pulido del Manantial del Alba', desc: 'Limpiar lavamanos', puntos: 20 }
          ]
      },
      {
          id: 'limpiar_cocina',
          nombre: 'Brillo en el Corazón del Hogar',
          desc: 'Limpiar la cocina',
          buff: 'Rico olor del hogar',
          puntosBuffCompleto: 20,
          subtareas: [
              { id: 'limpiar_cocina_frutero', nombre: 'Cuidado del Huerto de las Delicias', desc: 'Limpiar el frutero', puntos: 20 },
              { id: 'limpiar_cocina_fregadero', nombre: 'Purificación Altar de Fuego y Agua', desc: 'Limpiar fregadero y cocina', puntos: 20 },
              { id: 'limpiar_cocina_microondas', nombre: 'Cámara de Impulso Térmico', desc: 'Limpiar microondas', puntos: 20 },
              { id: 'limpiar_cocina_estante', nombre: 'Orden de los Estantes de Alquimia', desc: 'Limpiar el estante sobre el mesón', puntos: 20 }
          ]
      },
      {
          id: 'limpiar_salon',
          nombre: 'Orden del Salón de Guerra',
          desc: 'Limpiar el salón',
          buff: 'Estratega Maestro',
          puntosBuffCompleto: 20,
          subtareas: [
              { id: 'limpiar_salon_sofa', nombre: 'Restauración del Trono Acolchado', desc: 'Limpiar el sofá', puntos: 20 },
              { id: 'limpiar_salon_alfombra', nombre: 'Peinado de la Pradera Interior', desc: 'Aspirar la alfombra', puntos: 20 },
              { id: 'limpiar_salon_comedor', nombre: 'Pulido del Tablero de Reuniones', desc: 'Limpiar el comedor', puntos: 20 },
              { id: 'limpiar_salon_superficies', nombre: 'Brillo del Escudo del Hogar', desc: 'Limpiar superficies', puntos: 20 }
          ]
      }
];

const MISIONES_SEMANALES_SUELTAS = [
      { id: 'limpiar_recibidor', nombre: 'Despeje de la Senda del Viajero', desc: 'Limpiar recibidor y pasillo', puntos: 30, jugador: null },
      { id: 'limpiar_logia', nombre: 'Expedición a la Logia Olvidada', desc: 'Limpiar la logia', puntos: 30, jugador: null },
      { id: 'limpiar_terraza', nombre: 'Conquista de la Atalaya Externa', desc: 'Limpiar la terraza', puntos: 30, jugador: null },
      { id: 'planificar_comidas', nombre: 'Estrategia de Suministros del Reino', desc: 'Planificar comidas de la semana', puntos: 30, jugador: null, compartida: true },
      { id: 'actualizar_compras', nombre: 'Censo de Provisiones Necesarias', desc: 'Actualizar lista de compras', puntos: 30, jugador: null, compartida: true },
      { id: 'hacer_mercado', nombre: 'Incursión en el Mercado de los Tesoros', desc: 'Hacer mercado el día de oferta', puntos: 40, jugador: null, compartida: true },
      { id: 'cocinar_almuerzo_1', nombre: 'Gran Alquimia del Banquete Fase I', desc: 'Cocinar almuerzo 1', puntos: 25, jugador: null },
      { id: 'cocinar_almuerzo_2', nombre: 'Gran Alquimia del Banquete Fase II', desc: 'Cocinar almuerzo 2', puntos: 25, jugador: null },
      { id: 'cocinar_almuerzo_3', nombre: 'Gran Alquimia del Banquete Fase III', desc: 'Cocinar almuerzo 3', puntos: 25, jugador: null },
      { id: 'cocinar_almuerzo_4', nombre: 'Gran Alquimia del Banquete Fase IV', desc: 'Cocinar almuerzo 4', puntos: 25, jugador: null },
      { id: 'ejercicio_fuerza_1_mono', nombre: 'Forja del Guerrero de Bronce 🐵', desc: 'Hacer ejercicios de fuerza 1', puntos: 15, jugador: 'mono' },
      { id: 'ejercicio_fuerza_1_oso', nombre: 'Forja del Guerrero de Bronce 🐻', desc: 'Hacer ejercicios de fuerza 1', puntos: 15, jugador: 'oso' },
      { id: 'ejercicio_fuerza_2_mono', nombre: 'Forja del Guerrero de Plata 🐵', desc: 'Hacer ejercicios de fuerza 2', puntos: 15, jugador: 'mono' },
      { id: 'ejercicio_fuerza_2_oso', nombre: 'Forja del Guerrero de Plata 🐻', desc: 'Hacer ejercicios de fuerza 2', puntos: 15, jugador: 'oso' },
      { id: 'ejercicio_fuerza_3_mono', nombre: 'Forja del Guerrero de Oro 🐵', desc: 'Hacer ejercicios de fuerza 3', puntos: 15, jugador: 'mono' },
      { id: 'ejercicio_fuerza_3_oso', nombre: 'Forja del Guerrero de Oro 🐻', desc: 'Hacer ejercicios de fuerza 3', puntos: 15, jugador: 'oso' },
      { id: 'lavar_ropa', nombre: 'Ritual de la Hebra Limpia (Lavado)', desc: 'Lavar la ropa', puntos: 25, jugador: null },
      { id: 'doblar_ropa', nombre: 'Ritual de la Hebra Limpia (Armadura)', desc: 'Doblar la ropa', puntos: 25, jugador: null },
      { id: 'aspirar_1', nombre: 'Torbellino Erradicador de Polvo I', desc: 'Aspirar 1ra vez', puntos: 20, jugador: null },
      { id: 'aspirar_2', nombre: 'Torbellino Erradicador de Polvo II', desc: 'Aspirar 2da vez', puntos: 20, jugador: null },
      { id: 'aspirar_3', nombre: 'Torbellino Erradicador de Polvo III', desc: 'Aspirar 3ra vez', puntos: 20, jugador: null },
      { id: 'trapear_1', nombre: 'Rastreo del Sendero Brillante I', desc: 'Pasar trapeador 1ra vez', puntos: 20, jugador: null },
      { id: 'trapear_2', nombre: 'Rastreo del Sendero Brillante II', desc: 'Pasar trapeador 2da vez', puntos: 20, jugador: null },
      { id: 'trapear_3', nombre: 'Rastreo del Sendero Brillante III', desc: 'Pasar trapeador 3ra vez', puntos: 20, jugador: null },
      { id: 'basura_1', nombre: 'Exilio de los Residuos I', desc: 'Sacar todas las basuras I', puntos: 20, jugador: null },
      { id: 'basura_2', nombre: 'Exilio de los Residuos II', desc: 'Sacar todas las basuras II', puntos: 20, jugador: null },
      { id: 'basura_3', nombre: 'Exilio de los Residuos III', desc: 'Sacar todas las basuras III', puntos: 20, jugador: null }
  ];

  const MISIONES_MENSUALES = [
      { id: 'limpiar_refrigerador', nombre: 'Cacería de la Escarcha Ancestral', desc: 'Limpieza profunda del refrigerador', puntos: 200, jugador: null },
      { id: 'limpiar_alacenas', nombre: 'Excavación en las Bóvedas de Suministros', desc: 'Limpieza profunda de las alacenas', puntos: 200, jugador: null },
      { id: 'limpiar_horno', nombre: 'Purificación del Crisol del Fuego', desc: 'Limpieza del horno', puntos: 200, jugador: null },
      { id: 'mantenimiento_bambi', nombre: 'Bendición de la Criatura Creadora del Bosque', desc: 'Mantenimiento de Bambi', puntos: 250, jugador: null },
      { id: 'ahorrar_mono', nombre: 'El Tesoro del Dragón', desc: 'Ahorrar según el monto acordado', puntos: 150, jugador: 'mono' },
      { id: 'ahorrar_oso', nombre: 'El Tesoro del Dragón', desc: 'Ahorrar según el monto acordado', puntos: 150, jugador: 'oso' },
      { id: 'pagar_deuda_mono', nombre: 'Aniquilación de la Sombra de la Deuda', desc: 'Pagar el monto mensual de las TDCs', puntos: 150, jugador: 'mono' },
      { id: 'pagar_deuda_oso', nombre: 'Aniquilación de la Sombra de la Deuda', desc: 'Pagar el monto mensual de las TDCs', puntos: 150, jugador: 'oso' }
  ];

  const NIVELES_BATTLE_PASS = [
      { nivel: 1,  xpRequerido: 80,   icono: '🌳', nombre: 'Bosque Burbuja', premios: [
        { nombre: 'Picnic en el bosque', emoji: '🧺', costo: 200},
        { nombre: 'Néctar Helado', emoji: '🍦', costo: 80},
        { nombre: 'Pase del festival de la ciudad', emoji: '🎫', costo: 300}
      ]
    },
      { nivel: 2,  xpRequerido: 660,  icono: '🏙️', nombre: 'Monópolis', premios: [
        { nombre: 'Almuerzo en el MoniMall', emoji: '🍽️', costo: 200},
        { nombre: 'Brunch motinal', emoji: '☕', costo: 250},
        { nombre: 'Néctar Helado', emoji: '🍦', costo: 80},
        { nombre: 'Hobbybox de plata', emoji: '🥈', costo: 300}
      ] },
      
      { nivel: 3,  xpRequerido: 1490,  icono: '🏞️', nombre: 'Lago Marquesa', premios: [
        { nombre: 'Panqueques frente al lago', emoji: '🥞', costo: 200},
        { nombre: 'Néctar Helado', emoji: '🍦', costo: 80},
        { nombre: 'Hobbybox de plata', emoji: '🥈', costo: 300}
      ]},
      { nivel: 4,  xpRequerido: 2070,  icono: '☃️', nombre: 'Valle Nevoso', premios: [
        { nombre: 'Cena al calor de la chimenea', emoji: '🍽️', costo: 200},
        { nombre: 'Néctar Helado', emoji: '🍦', costo: 80},
        { nombre: 'Brunch motinal', emoji: '☕', costo: 250},
        { nombre: 'Hobbybox de oro', emoji: '🏆', costo: 1000}
      ]},
  ];

  const PROVISIONES_DEFAULT = {
    categorias: [
  { id: 'c0', nombre: 'Aseo',                           icono: '🧹' },                                                                                                                                                      
  { id: 'c1', nombre: 'Higiene',                        icono: '🧴' },                                                                                                                                                     
  { id: 'c2', nombre: 'Provisiones de Cocina',          icono: '🍳' },
  { id: 'c3', nombre: 'Lácteos y Embutidos',            icono: '🧀' },
  { id: 'c4', nombre: 'Carnes y Huevos',                icono: '🥩' },
  { id: 'c5', nombre: 'Alacena',                        icono: '🫙' },
  { id: 'c6', nombre: 'Frutas, Vegetales y Hortalizas', icono: '🥦' },
  { id: 'c7', nombre: 'Farmacia',                       icono: '💊' },
    ],
    items: [
      { id: 'p000', categoria: 'c0', nombre: 'Lysoform',                    hay: false, cantidad: 0 },
      { id: 'p001', categoria: 'c0', nombre: 'Papel absorbente',             hay: false, cantidad: 0 },
      { id: 'p002', categoria: 'c0', nombre: 'Desinfectante para pisos',     hay: false, cantidad: 0 },
      { id: 'p003', categoria: 'c0', nombre: 'Limpiador de madera',          hay: false, cantidad: 0 },
      { id: 'p004', categoria: 'c0', nombre: 'Limpiador de superficies',     hay: false, cantidad: 0 },
      { id: 'p005', categoria: 'c0', nombre: 'Limpiador de baño',            hay: false, cantidad: 0 },
      { id: 'p006', categoria: 'c0', nombre: 'Limpiador de inodoro',         hay: false, cantidad: 0 },
      { id: 'p007', categoria: 'c0', nombre: 'Bolsas medianas',              hay: false, cantidad: 0 },
      { id: 'p008', categoria: 'c0', nombre: 'Bolsas pequeñas',              hay: false, cantidad: 0 },
      { id: 'p009', categoria: 'c0', nombre: 'Esponjas',                     hay: false, cantidad: 0 },
      { id: 'p010', categoria: 'c0', nombre: 'Jabón lavaplatos',             hay: false, cantidad: 0 },
      { id: 'p011', categoria: 'c0', nombre: 'Jabón para lavar',             hay: false, cantidad: 0 },

      { id: 'p100', categoria: 'c1', nombre: 'Papel higiénico',              hay: false, cantidad: 0 },
      { id: 'p101', categoria: 'c1', nombre: 'Pasta dental',                 hay: false, cantidad: 0 },
      { id: 'p102', categoria: 'c1', nombre: 'Jabón líquido',                hay: false, cantidad: 0 },
      { id: 'p103', categoria: 'c1', nombre: 'Jabón de mano',                hay: false, cantidad: 0 },
      { id: 'p104', categoria: 'c1', nombre: 'Desodorante',                  hay: false, cantidad: 0 },
      { id: 'p105', categoria: 'c1', nombre: 'Talco para pies',              hay: false, cantidad: 0 },

      { id: 'p200', categoria: 'c2', nombre: 'Bolsas Ziploc',                hay: false, cantidad: 0 },
      { id: 'p201', categoria: 'c2', nombre: 'Papel mantequilla',            hay: false, cantidad: 0 },
      { id: 'p202', categoria: 'c2', nombre: 'Papel aluminio',               hay: false, cantidad: 0 },
      { id: 'p203', categoria: 'c2', nombre: 'Papel plástico',               hay: false, cantidad: 0 },

      { id: 'p300', categoria: 'c3', nombre: 'Queso laminado',               hay: false, cantidad: 0 },
      { id: 'p301', categoria: 'c3', nombre: 'Jamón de pavo',                hay: false, cantidad: 0 },
      { id: 'p302', categoria: 'c3', nombre: 'Leche',                        hay: false, cantidad: 0 },
      { id: 'p303', categoria: 'c3', nombre: 'Bebida vegetal',               hay: false, cantidad: 0 },
      { id: 'p304', categoria: 'c3', nombre: 'Mantequilla',                  hay: false, cantidad: 0 },
      { id: 'p305', categoria: 'c3', nombre: 'Queso Parmesano',              hay: false, cantidad: 0 },

      { id: 'p400', categoria: 'c4', nombre: 'Pollo',                        hay: false, cantidad: 0 },
      { id: 'p401', categoria: 'c4', nombre: 'Carne molida',                 hay: false, cantidad: 0 },
      { id: 'p402', categoria: 'c4', nombre: 'Bistec de carne',              hay: false, cantidad: 0 },
      { id: 'p403', categoria: 'c4', nombre: 'Huevos',                       hay: false, cantidad: 0 },
      { id: 'p404', categoria: 'c4', nombre: 'Chorizos',                     hay: false, cantidad: 0 },

      { id: 'p500', categoria: 'c5', nombre: 'Harina de trigo',              hay: false, cantidad: 0 },
      { id: 'p501', categoria: 'c5', nombre: 'Spaghetti',                    hay: false, cantidad: 0 },
      { id: 'p502', categoria: 'c5', nombre: 'Rigati',                       hay: false, cantidad: 0 },
      { id: 'p503', categoria: 'c5', nombre: 'Arroz',                        hay: false, cantidad: 0 },
      { id: 'p504', categoria: 'c5', nombre: 'Harina de repostería',         hay: false, cantidad: 0 },
      { id: 'p505', categoria: 'c5', nombre: 'Harina de fuerza',             hay: false, cantidad: 0 },
      { id: 'p506', categoria: 'c5', nombre: 'Azúcar',                       hay: false, cantidad: 0 },
      { id: 'p507', categoria: 'c5', nombre: 'Sal',                          hay: false, cantidad: 0 },
      { id: 'p508', categoria: 'c5', nombre: 'Tortillas',                    hay: false, cantidad: 0 },
      { id: 'p509', categoria: 'c5', nombre: 'Cereal Oso',                   hay: false, cantidad: 0 },
      { id: 'p510', categoria: 'c5', nombre: 'Cereal Mono',                  hay: false, cantidad: 0 },

      { id: 'p600', categoria: 'c6', nombre: 'Tomates triturados',           hay: false, cantidad: 0 },
      { id: 'p601', categoria: 'c6', nombre: 'Ajo triturado',                hay: false, cantidad: 0 },
      { id: 'p602', categoria: 'c6', nombre: 'Pimentón',                     hay: false, cantidad: 0 },
      { id: 'p603', categoria: 'c6', nombre: 'Zanahorias',                   hay: false, cantidad: 0 },
      { id: 'p604', categoria: 'c6', nombre: 'Tomates',                      hay: false, cantidad: 0 },
      { id: 'p605', categoria: 'c6', nombre: 'Tomates cherry',               hay: false, cantidad: 0 },
      { id: 'f00', categoria: 'c7', nombre: 'Aerogastrol',                   hay: false, cantidad: 0 },
    { id: 'f01', categoria: 'c7', nombre: 'Alcohol 70°',                     hay: false, cantidad: 0 },
    { id: 'f02', categoria: 'c7', nombre: 'Ambroxol',                        hay: false, cantidad: 0 },
    { id: 'f03', categoria: 'c7', nombre: 'Antiax',                          hay: false, cantidad: 0 },
    { id: 'f04', categoria: 'c7', nombre: 'Atenolol',                        hay: false, cantidad: 0 },
    { id: 'f05', categoria: 'c7', nombre: 'Azitromicina 500 mg',             hay: false, cantidad: 0 },
    { id: 'f06', categoria: 'c7', nombre: 'Bacitracina',                     hay: false, cantidad: 0 },
    { id: 'f07', categoria: 'c7', nombre: 'Cefadroxilo',                     hay: false, cantidad: 0 },
    { id: 'f08', categoria: 'c7', nombre: 'Celecoxib',                       hay: false, cantidad: 0 },
    { id: 'f09', categoria: 'c7', nombre: 'Cinta médica',                    hay: false, cantidad: 0 },
    { id: 'f10', categoria: 'c7', nombre: 'Crema Antihistamínico',           hay: false, cantidad: 0 },
    { id: 'f11', categoria: 'c7', nombre: 'Curitas',                         hay: false, cantidad: 0 },
    { id: 'f12', categoria: 'c7', nombre: 'Degraler',                        hay: false, cantidad: 0 },
    { id: 'f13', categoria: 'c7', nombre: 'Desloratadina',                   hay: false, cantidad: 0 },
    { id: 'f14', categoria: 'c7', nombre: 'Diclofenaco',                     hay: false, cantidad: 0 },
    { id: 'f15', categoria: 'c7', nombre: 'Domperidona',                     hay: false, cantidad: 0 },
    { id: 'f16', categoria: 'c7', nombre: 'Donomix',                         hay: false, cantidad: 0 },
    { id: 'f17', categoria: 'c7', nombre: 'Extra Life',                      hay: false, cantidad: 0 },
    { id: 'f18', categoria: 'c7', nombre: 'Flurbiprofeno',                   hay: false, cantidad: 0 },
    { id: 'f19', categoria: 'c7', nombre: 'Fosfosoda',                       hay: false, cantidad: 0 },
    { id: 'f20', categoria: 'c7', nombre: 'Gasa elástica',                   hay: false, cantidad: 0 },
    { id: 'f21', categoria: 'c7', nombre: 'Gastrezol',                       hay: false, cantidad: 0 },
    { id: 'f22', categoria: 'c7', nombre: 'Ibuprofeno 400 mg',               hay: false, cantidad: 0 },
    { id: 'f23', categoria: 'c7', nombre: 'Ibuprofeno 600 mg',               hay: false, cantidad: 0 },
    { id: 'f24', categoria: 'c7', nombre: 'Levocetirizina',                  hay: false, cantidad: 0 },
    { id: 'f25', categoria: 'c7', nombre: 'Líquido lentes de contacto',      hay: false, cantidad: 0 },
    { id: 'f26', categoria: 'c7', nombre: 'Loperamida',                      hay: false, cantidad: 0 },
    { id: 'f27', categoria: 'c7', nombre: 'Loratadina',                      hay: false, cantidad: 0 },
    { id: 'f28', categoria: 'c7', nombre: 'Mareamin',                        hay: false, cantidad: 0 },
    { id: 'f29', categoria: 'c7', nombre: 'Omeprazol',                       hay: false, cantidad: 0 },
    { id: 'f30', categoria: 'c7', nombre: 'Oximetazolina Clorhidrato',       hay: false, cantidad: 0 },
    { id: 'f31', categoria: 'c7', nombre: 'Paracetamol 1 g',                 hay: false, cantidad: 0 },
    { id: 'f32', categoria: 'c7', nombre: 'Paracetamol 500 mg',              hay: false, cantidad: 0 },
    { id: 'f33', categoria: 'c7', nombre: 'Parche caliente',                 hay: false, cantidad: 0 },
    { id: 'f34', categoria: 'c7', nombre: 'Povidona Yodada',                 hay: false, cantidad: 0 },
    { id: 'f35', categoria: 'c7', nombre: 'Rupatadina',                      hay: false, cantidad: 0 }
    ]
  };

  const PRESUPUESTO_DEFAULT = {
    categorias: [
      { id: 'pcat_hogar',           nombre: 'Gastos del Hogar',        icono: '🏠' },
      { id: 'pcat_tdcs',            nombre: 'TDCs y Préstamos',        icono: '💳' },
      { id: 'pcat_suscripciones',   nombre: 'Suscripciones y Seguros', icono: '📱' },
      { id: 'pcat_entretenimiento', nombre: 'Entretenimiento y Ocio',  icono: '🎉' },
      { id: 'pcat_compras',         nombre: 'Compras',                 icono: '🛍️' },
      { id: 'pcat_salud',           nombre: 'Salud',                   icono: '💊' },
      { id: 'pcat_familia',         nombre: 'Familia',                 icono: '👨‍👩‍👧' },
      { id: 'pcat_transporte',      nombre: 'Transporte',              icono: '🚌' },
      { id: 'pcat_inversion',       nombre: 'Inversión y Ahorro',      icono: '📈' },
    ],
    subcategorias: [
      { id: 'psub_arriendo',           categoriaId: 'pcat_hogar',           icono: '🏘️',  nombre: 'Arriendo',             presupuesto: 0 },
      { id: 'psub_internet',           categoriaId: 'pcat_hogar',           icono: '📡',  nombre: 'Internet',             presupuesto: 0 },
      { id: 'psub_electricidad',       categoriaId: 'pcat_hogar',           icono: '⚡',  nombre: 'Electricidad',         presupuesto: 0 },
      { id: 'psub_agua',               categoriaId: 'pcat_hogar',           icono: '💧',  nombre: 'Agua',                 presupuesto: 0 },
      { id: 'psub_telefonos',          categoriaId: 'pcat_hogar',           icono: '📱',  nombre: 'Teléfonos',            presupuesto: 0 },
      { id: 'psub_supermercado',       categoriaId: 'pcat_hogar',           icono: '🛒',  nombre: 'Supermercado',         presupuesto: 0 },

      { id: 'psub_tdc_bci',            categoriaId: 'pcat_tdcs',            icono: '💳',  nombre: 'TDC BCI Signature',    presupuesto: 0 },
      { id: 'psub_tdc_falabella_oso',  categoriaId: 'pcat_tdcs',            icono: '💳',  nombre: 'TDC Falabella Oso',    presupuesto: 0 },
      { id: 'psub_tdc_falabella_mono', categoriaId: 'pcat_tdcs',            icono: '💳',  nombre: 'TDC Falabella Mono',   presupuesto: 0 },
      { id: 'psub_tdc_cencosud',       categoriaId: 'pcat_tdcs',            icono: '💳',  nombre: 'TDC Cencosud',         presupuesto: 0 },
      { id: 'psub_tdc_santander',      categoriaId: 'pcat_tdcs',            icono: '💳',  nombre: 'TDC Santander',        presupuesto: 0 },
      { id: 'psub_prestamo_santander', categoriaId: 'pcat_tdcs',            icono: '🏦',  nombre: 'Préstamo Santander',   presupuesto: 0 },
      { id: 'psub_prestamo_cencosud',  categoriaId: 'pcat_tdcs',            icono: '🏦',  nombre: 'Préstamo Cencosud',    presupuesto: 0 },

      { id: 'psub_seguros',            categoriaId: 'pcat_suscripciones',   icono: '🛡️',  nombre: 'Seguros',              presupuesto: 0 },
      { id: 'psub_suscripciones',      categoriaId: 'pcat_suscripciones',   icono: '📺',  nombre: 'Suscripciones',        presupuesto: 0 },

      { id: 'psub_salidas',            categoriaId: 'pcat_entretenimiento', icono: '🎭',  nombre: 'Salidas',              presupuesto: 0 },
      { id: 'psub_restaurantes',       categoriaId: 'pcat_entretenimiento', icono: '🍽️',  nombre: 'Restaurantes',         presupuesto: 0 },
      { id: 'psub_deportes',           categoriaId: 'pcat_entretenimiento', icono: '🏋️',  nombre: 'Deportes & Gym',       presupuesto: 0 },
      { id: 'psub_hobbies_entr',       categoriaId: 'pcat_entretenimiento', icono: '🎨',  nombre: 'Hobbies',              presupuesto: 0 },

      { id: 'psub_compras_hogar',      categoriaId: 'pcat_compras',         icono: '🏠',  nombre: 'Hogar',                presupuesto: 0 },
      { id: 'psub_guardarropa',        categoriaId: 'pcat_compras',         icono: '👕',  nombre: 'Guardarropa',          presupuesto: 0 },
      { id: 'psub_juegos',             categoriaId: 'pcat_compras',         icono: '🎮',  nombre: 'Juegos & Hobbies',     presupuesto: 0 },
      { id: 'psub_regalos',            categoriaId: 'pcat_compras',         icono: '🎁',  nombre: 'Regalos',              presupuesto: 0 },
      { id: 'psub_personales_mono',    categoriaId: 'pcat_compras',         icono: '🐵',  nombre: 'Personales 🐵',        presupuesto: 0 },
      { id: 'psub_personales_oso',     categoriaId: 'pcat_compras',         icono: '🐻',  nombre: 'Personales 🐻',        presupuesto: 0 },

      { id: 'psub_medico',             categoriaId: 'pcat_salud',           icono: '🩺',  nombre: 'Médico',               presupuesto: 0 },
      { id: 'psub_medicamentos',       categoriaId: 'pcat_salud',           icono: '💊',  nombre: 'Medicamentos',         presupuesto: 0 },
      { id: 'psub_skincare',           categoriaId: 'pcat_salud',           icono: '🧴',  nombre: 'Skincare & Aseo',      presupuesto: 0 },

      { id: 'psub_remesas',            categoriaId: 'pcat_familia',         icono: '💸',  nombre: 'Remesas familiares',   presupuesto: 0 },

      { id: 'psub_transporte_pub',     categoriaId: 'pcat_transporte',      icono: '🚌',  nombre: 'Transporte público',   presupuesto: 0 },
      { id: 'psub_transporte_otros',   categoriaId: 'pcat_transporte',      icono: '🚗',  nombre: 'Otros transportes',    presupuesto: 0 },

      { id: 'psub_inversion',          categoriaId: 'pcat_inversion',       icono: '📈',  nombre: 'Inversión',            presupuesto: 0 },
      { id: 'psub_ahorro',             categoriaId: 'pcat_inversion',       icono: '🏦',  nombre: 'Ahorro',               presupuesto: 0 },
    ]
  };