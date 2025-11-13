// SDIWare Website Translations
const translations = {
    en: {
        nav: {
            home: "Home",
            features: "Features",
            contact: "Contact",
            useCases: "Use Cases",
            partners: "Partners",
            download: "Download",
            impressum: "Impressum"
        },
        hero: {
            titlePrefix: "Professional",
            titleSuffix: "Conversion",
            subtitle: "Advanced software solution for seamless conversion between SDI and NDI formats",
            feature1: "Minimal Latency",
            feature2: "10-bit HDR",
            feature3: "Alpha Channel",
            feature4: "Multi-Audio",
            feature5: "Intercom",
            cta1: "Download",
            cta2: "Learn More"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "2110 IP",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "Key Features",
            latency: {
                title: "Ultra-Low Latency",
                desc: "Real-time conversion with minimal delay, perfect for live production environments"
            },
            alpha: {
                title: "Alpha Channel Support",
                desc: "Full transparency support for professional graphics and overlay workflows"
            },
            hdr: {
                title: "10-bit HDR",
                desc: "High Dynamic Range with 10-bit color depth for superior image quality"
            },
            audio: {
                title: "Multi-Channel Audio",
                desc: "Comprehensive audio support for complex broadcast scenarios"
            },
            tally: {
                title: "Tally Integration",
                desc: "Built-in tally features for seamless production workflow integration"
            },
            preview: {
                title: "Program & Preview",
                desc: "Dual signal handling for both program and preview feeds"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Decode any Chromium Embedded Framework HTML renderer or website to a live broadcast signal (fill & key). Send video input back to the HTML renderer via WebRTC"
            }
        },
        useCases: {
            title: "Use Cases",
            subtitle: "SDIWare adapts to your production environment",
            studio: {
                title: "Live Studio Production",
                desc1: "SDI-Ware transforms web-based graphics engines like SPX into broadcast-ready systems. Convert HTML5 graphics to SDI/NDI/2110 output with professional features including tally support, intercom, and return video feed—all through an intuitive web interface. Full 4K HDR support for next-generation production standards.",
                desc2: "Deploy HTML5 graphics engines directly into multi-camera studio environments with full broadcast integration. SDI-Ware provides on-screen tally, external tally light control, and return video feed (RET) so camera operators see program output in their viewfinders.",
                desc3: "Combine SDI fill and key signals into a single NDI stream with alpha channel support. Output via traditional SDI, NDI, or SMPTE ST 2110 for IP-based facilities. Native 4K HDR workflow support ensures your graphics match the quality of modern camera systems."
            },
            broadcast: {
                title: "Outside Broadcast Production",
                desc1: "Replace racks of specialized equipment with compact, software-based solutions. Mount a single-board computer behind the camera viewfinder for a complete on-camera graphics and encoding system—exactly as proven during 174 hours of live production at the ISU Grand Prix Figure Skating.",
                desc2: "Hardware-agnostic design supports BMD Decklink, Magewell, and other capture cards. Built-in intercom with press-to-talk, external tally via Arduino interface, and network configuration through the web UI mean faster setup and fewer cables in the field. 4K HDR output ensures future-proof productions."
            },
            corporate: {
                title: "Live Corporate Events",
                desc1: "Bring broadcast-quality production to enterprise communications without requiring broadcast expertise. Town halls, product launches, investor presentations, and training sessions gain professional polish through HTML5 graphics that your web developers can create and modify in real-time. No specialized graphics operators needed—control everything through familiar web interfaces.",
                desc2: "Powered by industry leaders: SDI-Ware is integrated into mmagaxis.io hardware solutions, trusted by enterprises worldwide for corporate event production. This partnership combines mmagaxis.io's purpose-built corporate event platforms with SDI-Ware's flexible graphics-to-broadcast conversion, delivering turnkey solutions for professional communications teams.",
                desc3: "SpeedHQ encoding ensures low latency for live interaction, while NDI or ST 2110 output integrates seamlessly with modern production switchers and streaming platforms. Full 4K HDR support delivers premium visual quality for executive-level presentations. Deploy on mmagaxis.io hardware for validated, production-ready systems, or integrate SDI-Ware into your existing infrastructure."
            },
            remote: {
                title: "Remote and Cloud Production",
                desc1: "Enable distributed workflows where graphics, cameras, and control rooms exist in different locations. Run SDI-Ware on cloud servers or remote workstations, with NDI or SMPTE ST 2110 transport eliminating the need for dedicated video infrastructure.",
                desc2: "Configure all settings—NDI streams, 2110 flows, network parameters, audio routing, PiP positioning—through the web interface without touching the hardware. Compatible with NDI Bridge for running multiple instances on the same machine.",
                desc3: "Perfect for home studios, multi-site productions, or hybrid workflows combining on-premise and cloud resources. Scale from HD to 4K HDR as bandwidth and requirements evolve."
            }
        },
        partners: {
            title: "Technology Partners",
            subtitle: "Trusted integrations with industry-leading platforms"
        },
        download: {
            title: "Download SDIWare",
            subtitle: "Request your 30-day trial (download link valid for 48 hours)",
            pdfTitle: "Product Information",
            pdfDesc: "Download our detailed presentation to learn more about SDIWare features and specifications",
            pdfButton: "Download PDF",
            form: {
                name: "Full Name",
                email: "Email Address",
                company: "Company Name",
                role: "Your Role",
                useCase: "Intended Use Case",
                selectOption: "-- Select an option --",
                liveStudio: "Live Studio Production",
                obVan: "Outside Broadcast / OB Van",
                corporateEvents: "Corporate Events",
                remoteProduction: "Remote/Cloud Production",
                other: "Other",
                gdprConsent: "I agree to the processing of my personal data and accept the privacy policy",
                newsletter: "I would like to receive updates about SDIWare (optional)",
                submit: "Request Download Link"
            },
            info: {
                trial: {
                    title: "30-Day Trial",
                    desc: "Full-featured trial version with no limitations. Perfect for testing in your production environment."
                },
                instant: {
                    title: "Instant Access",
                    desc: "Receive your download link via email within minutes. No credit card required."
                },
                support: {
                    title: "Support Included",
                    desc: "Get technical support during your trial period to ensure smooth setup and operation."
                }
            }
        },
        contact: {
            title: "Get in Touch",
            text: "Interested in SDIWare? Contact us for licensing, support, or more information."
        },
        impressum: {
            title: "Impressum",
            company: "Company Information",
            legal_form: "Limited Liability Company",
            managing_director: "Managing Director",
            registered_office: "Registered Office",
            contact_heading: "Contact",
            email_label: "Email",
            web_label: "Website",
            legal: "Legal Information",
            vat: "VAT Number / P.IVA",
            rea: "REA Number",
            share_capital: "Share Capital",
            paid_in: "fully paid in",
            single_shareholder: "Single Shareholder Company",
            yes_no: "[Yes/No]",
            no: "No",
            disclaimer: "Disclaimer",
            disclaimer_text: "The content of this website has been created with the greatest possible care. However, we cannot guarantee the accuracy, completeness and timeliness of the content."
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            features: "Fonctionnalités",
            contact: "Contact",
            useCases: "Cas d'Usage",
            partners: "Partenaires",
            download: "Télécharger",
            impressum: "Mentions Légales"
        },
        hero: {
            titlePrefix: "Conversion Professionnelle",
            titleSuffix: "",
            subtitle: "Solution logicielle avancée pour une conversion transparente entre les formats SDI et NDI",
            feature1: "Latence Minimale",
            feature2: "HDR 10-bit",
            feature3: "Canal Alpha",
            feature4: "Multi-Audio",
            feature5: "Intercom",
            cta1: "Télécharger",
            cta2: "En Savoir Plus"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "IP 2110",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "Fonctionnalités Clés",
            latency: {
                title: "Latence Ultra-Faible",
                desc: "Conversion en temps réel avec un délai minimal, parfait pour les environnements de production en direct"
            },
            alpha: {
                title: "Support Canal Alpha",
                desc: "Support complet de la transparence pour les workflows graphiques professionnels et les incrustations"
            },
            hdr: {
                title: "HDR 10-bit",
                desc: "Haute gamme dynamique avec profondeur de couleur 10-bit pour une qualité d'image supérieure"
            },
            audio: {
                title: "Audio Multi-Canaux",
                desc: "Support audio complet pour les scénarios de diffusion complexes"
            },
            tally: {
                title: "Intégration Tally",
                desc: "Fonctions tally intégrées pour une intégration transparente du workflow de production"
            },
            preview: {
                title: "Programme & Aperçu",
                desc: "Gestion double signal pour les flux programme et aperçu"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Décodez n'importe quel moteur de rendu HTML Chromium Embedded Framework ou site web vers un signal de diffusion en direct (remplissage & clé). Renvoyez l'entrée vidéo au moteur de rendu HTML via WebRTC"
            }
        },
        useCases: {
            title: "Cas d'Usage",
            subtitle: "SDIWare s'adapte à votre environnement de production",
            studio: {
                title: "Production Studio en Direct",
                desc1: "SDI-Ware transforme les moteurs graphiques web comme SPX en systèmes prêts pour la diffusion. Convertissez les graphiques HTML5 en sortie SDI/NDI/2110 avec des fonctionnalités professionnelles incluant le support tally, l'intercom et le retour vidéo—le tout via une interface web intuitive. Support complet 4K HDR pour les standards de production de nouvelle génération.",
                desc2: "Déployez les moteurs graphiques HTML5 directement dans des environnements de studio multi-caméras avec une intégration broadcast complète. SDI-Ware fournit le tally à l'écran, le contrôle des voyants tally externes et le retour vidéo (RET) pour que les opérateurs de caméra voient la sortie programme dans leurs viseurs.",
                desc3: "Combinez les signaux SDI fill et key en un seul flux NDI avec support du canal alpha. Sortie via SDI traditionnel, NDI ou SMPTE ST 2110 pour les installations IP. Le support natif des workflows 4K HDR garantit que vos graphiques correspondent à la qualité des systèmes de caméra modernes."
            },
            broadcast: {
                title: "Production Reportage Mobile",
                desc1: "Remplacez des racks d'équipements spécialisés par des solutions compactes basées sur logiciel. Montez un ordinateur monocarte derrière le viseur de la caméra pour un système complet de graphiques et d'encodage sur caméra—exactement comme prouvé pendant 174 heures de production en direct au Grand Prix ISU de patinage artistique.",
                desc2: "Conception indépendante du matériel supportant les cartes de capture BMD Decklink, Magewell et autres. Intercom intégré avec push-to-talk, tally externe via interface Arduino, et configuration réseau via l'interface web signifient une installation plus rapide et moins de câbles sur le terrain. Sortie 4K HDR pour des productions à l'épreuve du temps."
            },
            corporate: {
                title: "Événements d'Entreprise en Direct",
                desc1: "Apportez une production de qualité broadcast aux communications d'entreprise sans nécessiter d'expertise en diffusion. Les assemblées générales, lancements de produits, présentations aux investisseurs et sessions de formation gagnent un vernis professionnel grâce aux graphiques HTML5 que vos développeurs web peuvent créer et modifier en temps réel. Pas besoin d'opérateurs graphiques spécialisés—contrôlez tout via des interfaces web familières.",
                desc2: "Propulsé par les leaders de l'industrie : SDI-Ware est intégré dans les solutions matérielles <a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a>, approuvées par les entreprises du monde entier pour la production d'événements d'entreprise. Ce partenariat combine les plateformes dédiées aux événements d'entreprise de mmagaxis.io avec la conversion graphique-vers-broadcast flexible de SDI-Ware, offrant des solutions clés en main pour les équipes de communication professionnelles.",
                desc3: "L'encodage SpeedHQ garantit une faible latence pour l'interaction en direct, tandis que la sortie NDI ou ST 2110 s'intègre parfaitement aux mélangeurs de production modernes et aux plateformes de streaming. Le support 4K HDR complet offre une qualité visuelle premium pour les présentations de niveau exécutif. Déployez sur du matériel mmagaxis.io pour des systèmes validés et prêts à la production, ou intégrez SDI-Ware dans votre infrastructure existante."
            },
            remote: {
                title: "Production Distante et Cloud",
                desc1: "Activez des workflows distribués où les graphiques, caméras et régies existent dans différents emplacements. Exécutez SDI-Ware sur des serveurs cloud ou des postes de travail distants, avec le transport NDI ou SMPTE ST 2110 éliminant le besoin d'infrastructure vidéo dédiée.",
                desc2: "Configurez tous les paramètres—flux NDI, flux 2110, paramètres réseau, routage audio, positionnement PiP—via l'interface web sans toucher au matériel. Compatible avec NDI Bridge pour exécuter plusieurs instances sur la même machine.",
                desc3: "Parfait pour les studios à domicile, les productions multi-sites ou les workflows hybrides combinant des ressources sur site et cloud. Passez de HD à 4K HDR au fur et à mesure que la bande passante et les exigences évoluent."
            }
        },
        partners: {
            title: "Partenaires Technologiques",
            subtitle: "Intégrations de confiance avec des plateformes leaders de l'industrie"
        },
        download: {
            title: "Télécharger SDIWare",
            subtitle: "Demandez votre essai de 30 jours (lien de téléchargement valide 48 heures)",
            pdfTitle: "Informations Produit",
            pdfDesc: "Téléchargez notre présentation détaillée pour en savoir plus sur les fonctionnalités et spécifications de SDIWare",
            pdfButton: "Télécharger PDF",
            form: {
                name: "Nom Complet",
                email: "Adresse E-mail",
                company: "Nom de l'Entreprise",
                role: "Votre Rôle",
                useCase: "Cas d'Usage Prévu",
                selectOption: "-- Sélectionnez une option --",
                liveStudio: "Production Studio en Direct",
                obVan: "Production Extérieure / Car Régie",
                corporateEvents: "Événements d'Entreprise",
                remoteProduction: "Production Distante/Cloud",
                other: "Autre",
                gdprConsent: "J'accepte le traitement de mes données personnelles et accepte la politique de confidentialité",
                newsletter: "Je souhaite recevoir des mises à jour sur SDIWare (optionnel)",
                submit: "Demander le Lien de Téléchargement"
            },
            info: {
                trial: {
                    title: "Essai de 30 Jours",
                    desc: "Version d'essai complète sans limitations. Parfait pour tester dans votre environnement de production."
                },
                instant: {
                    title: "Accès Instantané",
                    desc: "Recevez votre lien de téléchargement par e-mail en quelques minutes. Aucune carte de crédit requise."
                },
                support: {
                    title: "Support Inclus",
                    desc: "Bénéficiez d'un support technique pendant votre période d'essai pour garantir une installation et un fonctionnement fluides."
                }
            }
        },
        contact: {
            title: "Contactez-nous",
            text: "Intéressé par SDIWare ? Contactez-nous pour les licences, le support ou plus d'informations."
        },
        impressum: {
            title: "Mentions Légales",
            company: "Informations sur l'Entreprise",
            legal_form: "Société à Responsabilité Limitée",
            managing_director: "Directeur Général",
            registered_office: "Siège Social",
            contact_heading: "Contact",
            email_label: "Email",
            web_label: "Site Web",
            legal: "Informations Légales",
            vat: "Numéro de TVA / P.IVA",
            rea: "Numéro REA",
            share_capital: "Capital Social",
            paid_in: "entièrement libéré",
            single_shareholder: "Société Unipersonnelle",
            yes_no: "[Oui/Non]",
            no: "Non",
            disclaimer: "Clause de Non-Responsabilité",
            disclaimer_text: "Le contenu de ce site web a été créé avec le plus grand soin. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité et l'actualité du contenu."
        }
    },
    de: {
        nav: {
            home: "Startseite",
            features: "Funktionen",
            contact: "Kontakt",
            useCases: "Anwendungsfälle",
            partners: "Partner",
            download: "Herunterladen",
            impressum: "Impressum"
        },
        hero: {
            titlePrefix: "Professionelle",
            titleSuffix: "Konvertierung",
            subtitle: "Erweiterte Softwarelösung für nahtlose Konvertierung zwischen SDI- und NDI-Formaten",
            feature1: "Minimale Latenz",
            feature2: "10-bit HDR",
            feature3: "Alpha-Kanal",
            feature4: "Multi-Audio",
            feature5: "Intercom",
            cta1: "Herunterladen",
            cta2: "Mehr Erfahren"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "2110 IP",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "Hauptfunktionen",
            latency: {
                title: "Ultra-niedrige Latenz",
                desc: "Echtzeit-Konvertierung mit minimaler Verzögerung, perfekt für Live-Produktionsumgebungen"
            },
            alpha: {
                title: "Alpha-Kanal Unterstützung",
                desc: "Volle Transparenzunterstützung für professionelle Grafik- und Overlay-Workflows"
            },
            hdr: {
                title: "10-bit HDR",
                desc: "High Dynamic Range mit 10-bit Farbtiefe für überlegene Bildqualität"
            },
            audio: {
                title: "Mehrkanalige Audio",
                desc: "Umfassende Audio-Unterstützung für komplexe Broadcast-Szenarien"
            },
            tally: {
                title: "Tally-Integration",
                desc: "Integrierte Tally-Funktionen für nahtlose Produktions-Workflow-Integration"
            },
            preview: {
                title: "Programm & Vorschau",
                desc: "Duale Signalverarbeitung für Programm- und Vorschau-Feeds"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Dekodieren Sie jedes Chromium Embedded Framework HTML-Rendering oder jede Website zu einem Live-Broadcast-Signal (Fill & Key). Senden Sie Videoeingaben über WebRTC zurück an das HTML-Rendering"
            }
        },
        useCases: {
            title: "Anwendungsfälle",
            subtitle: "SDIWare passt sich Ihrer Produktionsumgebung an",
            studio: {
                title: "Live-Studioproduktion",
                desc1: "SDI-Ware verwandelt webbasierte Grafik-Engines wie SPX in broadcast-taugliche Systeme. Konvertieren Sie HTML5-Grafiken zu SDI/NDI/2110-Ausgängen mit professionellen Funktionen wie Tally-Unterstützung, Intercom und Return-Video-Feed—alles über eine intuitive Weboberfläche. Vollständige 4K HDR-Unterstützung für moderne Produktionsstandards.",
                desc2: "Setzen Sie HTML5-Grafik-Engines direkt in Mehrkamera-Studioumgebungen mit vollständiger Broadcast-Integration ein. SDI-Ware bietet On-Screen-Tally, externe Tally-Lichtsteuerung und Return-Video-Feed (RET), sodass Kameraoperatoren die Programmausgabe in ihren Suchern sehen.",
                desc3: "Kombinieren Sie SDI Fill- und Key-Signale zu einem einzelnen NDI-Stream mit Alphakanal-Unterstützung. Ausgabe über traditionelles SDI, NDI oder SMPTE ST 2110 für IP-basierte Einrichtungen. Native 4K HDR-Workflow-Unterstützung stellt sicher, dass Ihre Grafiken der Qualität moderner Kamerasysteme entsprechen."
            },
            broadcast: {
                title: "Außenübertragungsproduktion",
                desc1: "Ersetzen Sie Racks spezialisierter Ausrüstung durch kompakte, softwarebasierte Lösungen. Montieren Sie einen Einplatinencomputer hinter dem Kamerasucher für ein komplettes On-Camera-Grafik- und Encoding-System—genau wie während 174 Stunden Live-Produktion beim ISU Grand Prix Eiskunstlauf bewiesen.",
                desc2: "Hardware-agnostisches Design unterstützt BMD Decklink, Magewell und andere Capture-Karten. Eingebautes Intercom mit Push-to-Talk, externes Tally über Arduino-Interface und Netzwerkkonfiguration über die Web-UI bedeuten schnelleren Aufbau und weniger Kabel im Einsatz. 4K HDR-Ausgabe für zukunftssichere Produktionen."
            },
            corporate: {
                title: "Live-Firmenveranstaltungen",
                desc1: "Bringen Sie Broadcast-Qualität in die Unternehmenskommunikation ohne Broadcast-Expertise zu erfordern. Townhalls, Produkteinführungen, Investor-Präsentationen und Schulungen erhalten professionellen Glanz durch HTML5-Grafiken, die Ihre Webentwickler in Echtzeit erstellen und ändern können. Keine spezialisierten Grafikoperatoren erforderlich—steuern Sie alles über vertraute Weboberflächen.",
                desc2: "Angetrieben von Branchenführern: SDI-Ware ist in <a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a> Hardware-Lösungen integriert, weltweit von Unternehmen für Firmenveranstaltungen vertraut. Diese Partnerschaft kombiniert mmagaxis.ios zweckgebaute Firmenveranstaltungsplattformen mit SDI-Wares flexibler Grafik-zu-Broadcast-Konvertierung und liefert schlüsselfertige Lösungen für professionelle Kommunikationsteams.",
                desc3: "SpeedHQ-Encoding gewährleistet niedrige Latenz für Live-Interaktion, während NDI- oder ST 2110-Ausgabe nahtlos mit modernen Produktionsmischern und Streaming-Plattformen integriert. Vollständige 4K HDR-Unterstützung liefert Premium-Bildqualität für Präsentationen auf Führungsebene. Setzen Sie auf mmagaxis.io Hardware für validierte, produktionsbereite Systeme oder integrieren Sie SDI-Ware in Ihre bestehende Infrastruktur."
            },
            remote: {
                title: "Remote- und Cloud-Produktion",
                desc1: "Ermöglichen Sie verteilte Workflows, bei denen Grafiken, Kameras und Regieräume an verschiedenen Orten existieren. Führen Sie SDI-Ware auf Cloud-Servern oder Remote-Workstations aus, wobei NDI- oder SMPTE ST 2110-Transport die Notwendigkeit dedizierter Videoinfrastruktur eliminiert.",
                desc2: "Konfigurieren Sie alle Einstellungen—NDI-Streams, 2110-Flows, Netzwerkparameter, Audio-Routing, PiP-Positionierung—über die Weboberfläche ohne die Hardware zu berühren. Kompatibel mit NDI Bridge für die Ausführung mehrerer Instanzen auf derselben Maschine.",
                desc3: "Perfekt für Heimstudios, Multi-Standort-Produktionen oder hybride Workflows, die Vor-Ort- und Cloud-Ressourcen kombinieren. Skalieren Sie von HD zu 4K HDR, während Bandbreite und Anforderungen sich entwickeln."
            }
        },
        partners: {
            title: "Technologiepartner",
            subtitle: "Vertrauenswürdige Integrationen mit branchenführenden Plattformen"
        },
        download: {
            title: "SDIWare Herunterladen",
            subtitle: "Fordern Sie Ihre 30-Tage-Testversion an (Download-Link 48 Stunden gültig)",
            pdfTitle: "Produktinformationen",
            pdfDesc: "Laden Sie unsere detaillierte Präsentation herunter, um mehr über SDIWare-Funktionen und -Spezifikationen zu erfahren",
            pdfButton: "PDF Herunterladen",
            form: {
                name: "Vollständiger Name",
                email: "E-Mail-Adresse",
                company: "Firmenname",
                role: "Ihre Rolle",
                useCase: "Beabsichtigter Anwendungsfall",
                selectOption: "-- Bitte wählen --",
                liveStudio: "Live-Studioproduktion",
                obVan: "Außenübertragung / ÜWagen",
                corporateEvents: "Corporate Events",
                remoteProduction: "Remote-/Cloud-Produktion",
                other: "Sonstiges",
                gdprConsent: "Ich stimme der Verarbeitung meiner personenbezogenen Daten zu und akzeptiere die Datenschutzerklärung",
                newsletter: "Ich möchte Updates über SDIWare erhalten (optional)",
                submit: "Download-Link Anfordern"
            },
            info: {
                trial: {
                    title: "30-Tage-Test",
                    desc: "Voll funktionsfähige Testversion ohne Einschränkungen. Perfekt zum Testen in Ihrer Produktionsumgebung."
                },
                instant: {
                    title: "Sofortiger Zugang",
                    desc: "Erhalten Sie Ihren Download-Link innerhalb weniger Minuten per E-Mail. Keine Kreditkarte erforderlich."
                },
                support: {
                    title: "Support Inklusive",
                    desc: "Erhalten Sie technischen Support während Ihrer Testphase für eine reibungslose Einrichtung und Betrieb."
                }
            }
        },
        contact: {
            title: "Kontaktieren Sie Uns",
            text: "Interessiert an SDIWare? Kontaktieren Sie uns für Lizenzen, Support oder weitere Informationen."
        },
        impressum: {
            title: "Impressum",
            company: "Firmeninformationen",
            legal_form: "Gesellschaft mit beschränkter Haftung",
            managing_director: "Geschäftsführer",
            registered_office: "Rechtssitz",
            contact_heading: "Kontakt",
            email_label: "E-Mail",
            web_label: "Webseite",
            legal: "Rechtliche Informationen",
            vat: "MwSt.-Nr. / P.IVA",
            rea: "REA-Nummer",
            share_capital: "Gesellschaftskapital",
            paid_in: "vollständig eingezahlt",
            single_shareholder: "Einpersonengesellschaft",
            yes_no: "[Ja/Nein]",
            no: "Nein",
            disclaimer: "Haftungsausschluss",
            disclaimer_text: "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
        }
    },
    es: {
        nav: {
            home: "Inicio",
            features: "Características",
            contact: "Contacto",
            useCases: "Casos de Uso",
            partners: "Socios",
            download: "Descargar",
            impressum: "Aviso Legal"
        },
        hero: {
            titlePrefix: "Conversión Profesional",
            titleSuffix: "",
            subtitle: "Solución de software avanzada para conversión fluida entre formatos SDI y NDI",
            feature1: "Latencia Mínima",
            feature2: "HDR 10-bit",
            feature3: "Canal Alfa",
            feature4: "Multi-Audio",
            feature5: "Intercom",
            cta1: "Descargar",
            cta2: "Más Información"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "IP 2110",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "Características Principales",
            latency: {
                title: "Latencia Ultra-Baja",
                desc: "Conversión en tiempo real con retraso mínimo, perfecto para entornos de producción en vivo"
            },
            alpha: {
                title: "Soporte de Canal Alfa",
                desc: "Soporte completo de transparencia para flujos de trabajo de gráficos profesionales y superposiciones"
            },
            hdr: {
                title: "HDR 10-bit",
                desc: "Alto rango dinámico con profundidad de color de 10-bit para calidad de imagen superior"
            },
            audio: {
                title: "Audio Multicanal",
                desc: "Soporte de audio completo para escenarios de transmisión complejos"
            },
            tally: {
                title: "Integración Tally",
                desc: "Funciones tally integradas para integración perfecta del flujo de trabajo de producción"
            },
            preview: {
                title: "Programa y Vista Previa",
                desc: "Manejo de señal dual para feeds de programa y vista previa"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Decodifique cualquier renderizador HTML Chromium Embedded Framework o sitio web a una señal de transmisión en vivo (relleno y clave). Envíe la entrada de video de vuelta al renderizador HTML a través de WebRTC"
            }
        },
        useCases: {
            title: "Casos de Uso",
            subtitle: "SDIWare se adapta a su entorno de producción",
            studio: {
                title: "Producción de Estudio en Vivo",
                desc1: "SDI-Ware transforma motores gráficos basados en web como SPX en sistemas listos para transmisión. Convierta gráficos HTML5 a salida SDI/NDI/2110 con características profesionales que incluyen soporte tally, intercomunicador y retorno de video—todo a través de una interfaz web intuitiva. Soporte completo 4K HDR para estándares de producción de nueva generación.",
                desc2: "Implemente motores gráficos HTML5 directamente en entornos de estudio multicámara con integración de transmisión completa. SDI-Ware proporciona tally en pantalla, control de luz tally externa y retorno de video (RET) para que los operadores de cámara vean la salida del programa en sus visores.",
                desc3: "Combine señales SDI de relleno y clave en un solo flujo NDI con soporte de canal alfa. Salida a través de SDI tradicional, NDI o SMPTE ST 2110 para instalaciones basadas en IP. El soporte nativo de flujo de trabajo 4K HDR garantiza que sus gráficos coincidan con la calidad de los sistemas de cámara modernos."
            },
            broadcast: {
                title: "Producción de Transmisión Externa",
                desc1: "Reemplace racks de equipos especializados con soluciones compactas basadas en software. Monte una computadora de placa única detrás del visor de la cámara para un sistema completo de gráficos y codificación en cámara—exactamente como se demostró durante 174 horas de producción en vivo en el Gran Premio ISU de Patinaje Artístico.",
                desc2: "Diseño independiente del hardware que admite tarjetas de captura BMD Decklink, Magewell y otras. Intercomunicador incorporado con pulsar para hablar, tally externo a través de interfaz Arduino y configuración de red a través de la interfaz web significan una configuración más rápida y menos cables en el campo. Salida 4K HDR para producciones a prueba de futuro."
            },
            corporate: {
                title: "Eventos Corporativos en Vivo",
                desc1: "Aporte producción de calidad de transmisión a las comunicaciones empresariales sin requerir experiencia en difusión. Asambleas generales, lanzamientos de productos, presentaciones a inversionistas y sesiones de capacitación obtienen un pulido profesional a través de gráficos HTML5 que sus desarrolladores web pueden crear y modificar en tiempo real. No se necesitan operadores gráficos especializados—controle todo a través de interfaces web familiares.",
                desc2: "Impulsado por líderes de la industria: SDI-Ware está integrado en soluciones de hardware <a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a>, confiables por empresas de todo el mundo para la producción de eventos corporativos. Esta asociación combina las plataformas de eventos corporativos especialmente diseñadas de mmagaxis.io con la conversión flexible de gráficos a transmisión de SDI-Ware, entregando soluciones llave en mano para equipos de comunicaciones profesionales.",
                desc3: "La codificación SpeedHQ garantiza baja latencia para la interacción en vivo, mientras que la salida NDI o ST 2110 se integra sin problemas con mezcladores de producción modernos y plataformas de streaming. El soporte completo 4K HDR ofrece calidad visual premium para presentaciones de nivel ejecutivo. Implemente en hardware mmagaxis.io para sistemas validados y listos para producción, o integre SDI-Ware en su infraestructura existente."
            },
            remote: {
                title: "Producción Remota y en la Nube",
                desc1: "Habilite flujos de trabajo distribuidos donde los gráficos, cámaras y salas de control existen en diferentes ubicaciones. Ejecute SDI-Ware en servidores en la nube o estaciones de trabajo remotas, con transporte NDI o SMPTE ST 2110 eliminando la necesidad de infraestructura de video dedicada.",
                desc2: "Configure todos los ajustes—flujos NDI, flujos 2110, parámetros de red, enrutamiento de audio, posicionamiento PiP—a través de la interfaz web sin tocar el hardware. Compatible con NDI Bridge para ejecutar múltiples instancias en la misma máquina.",
                desc3: "Perfecto para estudios en casa, producciones multisitio o flujos de trabajo híbridos que combinan recursos locales y en la nube. Escale de HD a 4K HDR a medida que evolucionan el ancho de banda y los requisitos."
            }
        },
        partners: {
            title: "Socios Tecnológicos",
            subtitle: "Integraciones confiables con plataformas líderes de la industria"
        },
        download: {
            title: "Descargar SDIWare",
            subtitle: "Solicite su prueba de 30 días (enlace de descarga válido por 48 horas)",
            pdfTitle: "Información del Producto",
            pdfDesc: "Descargue nuestra presentación detallada para obtener más información sobre las características y especificaciones de SDIWare",
            pdfButton: "Descargar PDF",
            form: {
                name: "Nombre Completo",
                email: "Correo Electrónico",
                company: "Nombre de la Empresa",
                role: "Su Función",
                useCase: "Caso de Uso Previsto",
                selectOption: "-- Seleccione una opción --",
                liveStudio: "Producción de Estudio en Vivo",
                obVan: "Producción Externa / Unidad Móvil",
                corporateEvents: "Eventos Corporativos",
                remoteProduction: "Producción Remota/en la Nube",
                other: "Otro",
                gdprConsent: "Acepto el procesamiento de mis datos personales y acepto la política de privacidad",
                newsletter: "Me gustaría recibir actualizaciones sobre SDIWare (opcional)",
                submit: "Solicitar Enlace de Descarga"
            },
            info: {
                trial: {
                    title: "Prueba de 30 Días",
                    desc: "Versión de prueba completa sin limitaciones. Perfecto para probar en su entorno de producción."
                },
                instant: {
                    title: "Acceso Instantáneo",
                    desc: "Reciba su enlace de descarga por correo electrónico en minutos. No se requiere tarjeta de crédito."
                },
                support: {
                    title: "Soporte Incluido",
                    desc: "Obtenga soporte técnico durante su período de prueba para garantizar una configuración y operación fluidas."
                }
            }
        },
        contact: {
            title: "Póngase en Contacto",
            text: "¿Interesado en SDIWare? Contáctenos para licencias, soporte o más información."
        },
        impressum: {
            title: "Aviso Legal",
            company: "Información de la Empresa",
            legal_form: "Sociedad de Responsabilidad Limitada",
            managing_director: "Director General",
            registered_office: "Domicilio Social",
            contact_heading: "Contacto",
            email_label: "Email",
            web_label: "Sitio Web",
            legal: "Información Legal",
            vat: "Número de IVA / P.IVA",
            rea: "Número REA",
            share_capital: "Capital Social",
            paid_in: "totalmente desembolsado",
            single_shareholder: "Sociedad Unipersonal",
            yes_no: "[Sí/No]",
            no: "No",
            disclaimer: "Descargo de Responsabilidad",
            disclaimer_text: "El contenido de este sitio web ha sido creado con el mayor cuidado posible. Sin embargo, no podemos garantizar la exactitud, integridad y actualidad del contenido."
        }
    },
    it: {
        nav: {
            home: "Home",
            features: "Caratteristiche",
            contact: "Contatti",
            useCases: "Casi d'Uso",
            partners: "Partner",
            download: "Scarica",
            impressum: "Informazioni Legali"
        },
        hero: {
            titlePrefix: "Conversione Professionale",
            titleSuffix: "",
            subtitle: "Soluzione software avanzata per conversione fluida tra formati SDI e NDI",
            feature1: "Latenza Minima",
            feature2: "HDR 10-bit",
            feature3: "Canale Alpha",
            feature4: "Multi-Audio",
            feature5: "Intercom",
            cta1: "Scarica",
            cta2: "Scopri di Più"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "IP 2110",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "Caratteristiche Principali",
            latency: {
                title: "Latenza Ultra-Bassa",
                desc: "Conversione in tempo reale con ritardo minimo, perfetta per ambienti di produzione live"
            },
            alpha: {
                title: "Supporto Canale Alpha",
                desc: "Supporto completo della trasparenza per flussi di lavoro grafici professionali e overlay"
            },
            hdr: {
                title: "HDR 10-bit",
                desc: "High Dynamic Range con profondità colore a 10-bit per una qualità d'immagine superiore"
            },
            audio: {
                title: "Audio Multicanale",
                desc: "Supporto audio completo per scenari di trasmissione complessi"
            },
            tally: {
                title: "Integrazione Tally",
                desc: "Funzioni tally integrate per un'integrazione perfetta del flusso di lavoro di produzione"
            },
            preview: {
                title: "Programma e Anteprima",
                desc: "Gestione doppia del segnale per feed di programma e anteprima"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Decodifica qualsiasi renderer HTML Chromium Embedded Framework o sito web in un segnale broadcast live (riempimento e chiave). Invia il video in ingresso al renderer HTML tramite WebRTC"
            }
        },
        useCases: {
            title: "Casi d'Uso",
            subtitle: "SDIWare si adatta al tuo ambiente di produzione",
            studio: {
                title: "Produzione Studio in Diretta",
                desc1: "SDI-Ware trasforma motori grafici basati sul web come SPX in sistemi pronti per il broadcast. Converti grafica HTML5 in uscita SDI/NDI/2110 con funzionalità professionali tra cui supporto tally, intercom e feed video di ritorno—tutto attraverso un'interfaccia web intuitiva. Supporto completo 4K HDR per gli standard di produzione di nuova generazione.",
                desc2: "Implementa motori grafici HTML5 direttamente in ambienti studio multi-camera con integrazione broadcast completa. SDI-Ware fornisce tally su schermo, controllo delle luci tally esterne e feed video di ritorno (RET) in modo che gli operatori della telecamera vedano l'uscita del programma nei loro mirini.",
                desc3: "Combina segnali SDI fill e key in un singolo stream NDI con supporto del canale alfa. Uscita tramite SDI tradizionale, NDI o SMPTE ST 2110 per strutture basate su IP. Il supporto nativo del flusso di lavoro 4K HDR garantisce che la tua grafica corrisponda alla qualità dei sistemi di telecamere moderni."
            },
            broadcast: {
                title: "Produzione Outside Broadcast",
                desc1: "Sostituisci rack di apparecchiature specializzate con soluzioni compatte basate su software. Monta un computer a scheda singola dietro il mirino della telecamera per un sistema completo di grafica e codifica su telecamera—esattamente come dimostrato durante 174 ore di produzione dal vivo al Gran Premio ISU di Pattinaggio Artistico.",
                desc2: "Design hardware-agnostico che supporta schede di acquisizione BMD Decklink, Magewell e altre. Intercom integrato con push-to-talk, tally esterno tramite interfaccia Arduino e configurazione di rete tramite interfaccia web significano configurazione più rapida e meno cavi sul campo. Uscita 4K HDR per produzioni a prova di futuro."
            },
            corporate: {
                title: "Eventi Aziendali in Diretta",
                desc1: "Porta la produzione di qualità broadcast alle comunicazioni aziendali senza richiedere competenze di trasmissione. Town hall, lanci di prodotti, presentazioni agli investitori e sessioni di formazione acquisiscono lucentezza professionale attraverso grafica HTML5 che i tuoi sviluppatori web possono creare e modificare in tempo reale. Non sono necessari operatori grafici specializzati—controlla tutto attraverso interfacce web familiari.",
                desc2: "Alimentato da leader del settore: SDI-Ware è integrato nelle soluzioni hardware <a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a>, di cui si fidano le aziende di tutto il mondo per la produzione di eventi aziendali. Questa partnership combina le piattaforme per eventi aziendali appositamente costruite di mmagaxis.io con la conversione flessibile grafica-broadcast di SDI-Ware, fornendo soluzioni chiavi in mano per team di comunicazione professionali.",
                desc3: "La codifica SpeedHQ garantisce bassa latenza per l'interazione dal vivo, mentre l'uscita NDI o ST 2110 si integra perfettamente con mixer di produzione moderni e piattaforme di streaming. Il supporto completo 4K HDR offre qualità visiva premium per presentazioni di livello esecutivo. Implementa su hardware mmagaxis.io per sistemi validati e pronti per la produzione, o integra SDI-Ware nella tua infrastruttura esistente."
            },
            remote: {
                title: "Produzione Remota e Cloud",
                desc1: "Abilita flussi di lavoro distribuiti dove grafica, telecamere e sale di controllo esistono in posizioni diverse. Esegui SDI-Ware su server cloud o workstation remote, con trasporto NDI o SMPTE ST 2110 che elimina la necessità di infrastruttura video dedicata.",
                desc2: "Configura tutte le impostazioni—stream NDI, flussi 2110, parametri di rete, routing audio, posizionamento PiP—attraverso l'interfaccia web senza toccare l'hardware. Compatibile con NDI Bridge per eseguire più istanze sulla stessa macchina.",
                desc3: "Perfetto per home studio, produzioni multi-sito o flussi di lavoro ibridi che combinano risorse in sede e cloud. Scala da HD a 4K HDR man mano che la larghezza di banda e i requisiti si evolvono."
            }
        },
        partners: {
            title: "Partner Tecnologici",
            subtitle: "Integrazioni affidabili con piattaforme leader del settore"
        },
        download: {
            title: "Scarica SDIWare",
            subtitle: "Richiedi la tua prova di 30 giorni (link di download valido per 48 ore)",
            pdfTitle: "Informazioni sul Prodotto",
            pdfDesc: "Scarica la nostra presentazione dettagliata per saperne di più sulle funzionalità e specifiche di SDIWare",
            pdfButton: "Scarica PDF",
            form: {
                name: "Nome Completo",
                email: "Indirizzo Email",
                company: "Nome dell'Azienda",
                role: "Il Tuo Ruolo",
                useCase: "Caso d'Uso Previsto",
                selectOption: "-- Seleziona un'opzione --",
                liveStudio: "Produzione Studio in Diretta",
                obVan: "Produzione Esterna / Unità Mobile",
                corporateEvents: "Eventi Aziendali",
                remoteProduction: "Produzione Remota/Cloud",
                other: "Altro",
                gdprConsent: "Accetto il trattamento dei miei dati personali e accetto l'informativa sulla privacy",
                newsletter: "Vorrei ricevere aggiornamenti su SDIWare (opzionale)",
                submit: "Richiedi Link di Download"
            },
            info: {
                trial: {
                    title: "Prova di 30 Giorni",
                    desc: "Versione di prova completa senza limitazioni. Perfetta per testare nel tuo ambiente di produzione."
                },
                instant: {
                    title: "Accesso Istantaneo",
                    desc: "Ricevi il tuo link di download via email in pochi minuti. Nessuna carta di credito richiesta."
                },
                support: {
                    title: "Supporto Incluso",
                    desc: "Ottieni supporto tecnico durante il periodo di prova per garantire un'installazione e un funzionamento senza problemi."
                }
            }
        },
        contact: {
            title: "Contattaci",
            text: "Interessato a SDIWare? Contattaci per licenze, supporto o maggiori informazioni."
        },
        impressum: {
            title: "Informazioni Legali",
            company: "Informazioni sull'Azienda",
            legal_form: "Società a Responsabilità Limitata",
            managing_director: "Amministratore Delegato",
            registered_office: "Sede Legale",
            contact_heading: "Contatti",
            email_label: "Email",
            web_label: "Sito Web",
            legal: "Dati Legali",
            vat: "Partita IVA",
            rea: "Numero REA",
            share_capital: "Capitale Sociale",
            paid_in: "interamente versato",
            single_shareholder: "Società con Socio Unico",
            yes_no: "[Sì/No]",
            no: "No",
            disclaimer: "Disclaimer",
            disclaimer_text: "Il contenuto di questo sito web è stato creato con la massima cura possibile. Tuttavia, non possiamo garantire l'accuratezza, la completezza e l'attualità del contenuto."
        }
    },
    ja: {
        nav: {
            home: "ホーム",
            features: "機能",
            contact: "お問い合わせ",
            useCases: "使用事例",
            partners: "パートナー",
            download: "ダウンロード",
            impressum: "会社情報"
        },
        hero: {
            titlePrefix: "プロフェッショナル",
            titleSuffix: "コンバージョン",
            subtitle: "SDIとNDIフォーマット間のシームレスな変換のための高度なソフトウェアソリューション",
            feature1: "最小限のレイテンシー",
            feature2: "10ビットHDR",
            feature3: "アルファチャンネル",
            feature4: "マルチオーディオ",
            feature5: "インターカム",
            cta1: "ダウンロード",
            cta2: "詳しく見る"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "2110 IP",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "主要機能",
            latency: {
                title: "超低レイテンシー",
                desc: "最小限の遅延でリアルタイム変換を実現。ライブプロダクション環境に最適"
            },
            alpha: {
                title: "アルファチャンネルサポート",
                desc: "プロフェッショナルなグラフィックとオーバーレイワークフローのための完全な透明度サポート"
            },
            hdr: {
                title: "10ビットHDR",
                desc: "優れた画質のための10ビット色深度のハイダイナミックレンジ"
            },
            audio: {
                title: "マルチチャンネルオーディオ",
                desc: "複雑な放送シナリオのための包括的なオーディオサポート"
            },
            tally: {
                title: "タリー統合",
                desc: "シームレスなプロダクションワークフロー統合のための内蔵タリー機能"
            },
            preview: {
                title: "プログラム＆プレビュー",
                desc: "プログラムとプレビューフィードの両方に対応するデュアルシグナル処理"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "Chromium Embedded FrameworkのHTMLレンダラーやウェブサイトをライブ放送信号（フィル＆キー）にデコード。WebRTC経由でビデオ入力をHTMLレンダラーに送り返します"
            }
        },
        useCases: {
            title: "使用事例",
            subtitle: "SDIWareはあなたの制作環境に適応します",
            studio: {
                title: "ライブスタジオ制作",
                desc1: "SDI-WareはSPXのようなWebベースのグラフィックエンジンを放送対応システムに変換します。タリーサポート、インターカム、リターンビデオフィードを含むプロフェッショナル機能により、HTML5グラフィックをSDI/NDI/2110出力に変換—すべて直感的なWebインターフェースを通じて。次世代の制作標準のための完全な4K HDRサポート。",
                desc2: "完全な放送統合により、HTML5グラフィックエンジンをマルチカメラスタジオ環境に直接デプロイ。SDI-Wareはオンスクリーンタリー、外部タリーライト制御、リターンビデオフィード（RET）を提供し、カメラオペレーターがビューファインダーでプログラム出力を確認できます。",
                desc3: "SDIのフィルとキー信号をアルファチャンネルサポート付きの単一NDIストリームに結合。従来のSDI、NDI、またはIPベースの施設向けSMPTE ST 2110経由で出力。ネイティブ4K HDRワークフローサポートにより、グラフィックが最新のカメラシステムの品質に対応します。"
            },
            broadcast: {
                title: "アウトサイドブロードキャスト制作",
                desc1: "専門機器のラックをコンパクトなソフトウェアベースのソリューションに置き換え。カメラビューファインダーの背後にシングルボードコンピューターを取り付けて、ISUグランプリフィギュアスケートでの174時間のライブ制作で実証された完全なオンカメラグラフィックスとエンコーディングシステムを実現。",
                desc2: "ハードウェアに依存しない設計により、BMD Decklink、Magewell、その他のキャプチャカードをサポート。プッシュトゥトーク付き内蔵インターカム、Arduino インターフェース経由の外部タリー、Web UI経由のネットワーク構成により、現場でのセットアップが迅速になり、ケーブルが少なくなります。将来性のある制作のための4K HDR出力。"
            },
            corporate: {
                title: "ライブ企業イベント",
                desc1: "放送の専門知識を必要とせず、企業コミュニケーションに放送品質の制作をもたらします。タウンホール、製品発表、投資家向けプレゼンテーション、トレーニングセッションは、Webデベロッパーがリアルタイムで作成・変更できるHTML5グラフィックスを通じてプロフェッショナルな仕上がりになります。専門のグラフィックオペレーターは不要—使い慣れたWebインターフェースですべてをコントロール。",
                desc2: "業界リーダーによる支援：SDI-Wareは<a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a>ハードウェアソリューションに統合されており、企業イベント制作のために世界中の企業から信頼されています。このパートナーシップは、mmagaxis.ioの企業イベント専用プラットフォームとSDI-Wareの柔軟なグラフィックから放送への変換を組み合わせ、プロフェッショナルコミュニケーションチーム向けのターンキーソリューションを提供します。",
                desc3: "SpeedHQエンコーディングにより、ライブインタラクションのための低レイテンシーを確保し、NDIまたはST 2110出力は最新の制作スイッチャーやストリーミングプラットフォームとシームレスに統合。完全な4K HDRサポートにより、エグゼクティブレベルのプレゼンテーションにプレミアムな視覚品質を提供。検証済みの本番環境対応システムのためにmmagaxis.ioハードウェアにデプロイするか、既存のインフラストラクチャにSDI-Wareを統合。"
            },
            remote: {
                title: "リモート＆クラウド制作",
                desc1: "グラフィック、カメラ、コントロールルームが異なる場所に存在する分散ワークフローを実現。クラウドサーバーまたはリモートワークステーションでSDI-Wareを実行し、NDIまたはSMPTE ST 2110トランスポートにより専用ビデオインフラストラクチャの必要性を排除。",
                desc2: "すべての設定—NDIストリーム、2110フロー、ネットワークパラメータ、オーディオルーティング、PiPポジショニング—をハードウェアに触れることなくWebインターフェース経由で構成。同じマシン上で複数のインスタンスを実行するためのNDI Bridgeと互換性あり。",
                desc3: "ホームスタジオ、マルチサイト制作、オンプレミスとクラウドリソースを組み合わせたハイブリッドワークフローに最適。帯域幅と要件の進化に合わせてHDから4K HDRにスケール。"
            }
        },
        partners: {
            title: "テクノロジーパートナー",
            subtitle: "業界をリードするプラットフォームとの信頼できる統合"
        },
        download: {
            title: "SDIWareをダウンロード",
            subtitle: "30日間トライアルをリクエスト（ダウンロードリンクは48時間有効）",
            pdfTitle: "製品情報",
            pdfDesc: "SDIWareの機能と仕様の詳細については、詳細プレゼンテーションをダウンロードしてください",
            pdfButton: "PDFをダウンロード",
            form: {
                name: "氏名",
                email: "メールアドレス",
                company: "会社名",
                role: "役職",
                useCase: "使用目的",
                selectOption: "-- オプションを選択 --",
                liveStudio: "ライブスタジオ制作",
                obVan: "アウトサイドブロードキャスト / 中継車",
                corporateEvents: "企業イベント",
                remoteProduction: "リモート/クラウド制作",
                other: "その他",
                gdprConsent: "個人データの処理に同意し、プライバシーポリシーを受け入れます",
                newsletter: "SDIWareのアップデートを受け取りたい（任意）",
                submit: "ダウンロードリンクをリクエスト"
            },
            info: {
                trial: {
                    title: "30日間トライアル",
                    desc: "制限なしのフル機能トライアル版。制作環境でのテストに最適。"
                },
                instant: {
                    title: "即座にアクセス",
                    desc: "数分以内にメールでダウンロードリンクを受け取ります。クレジットカード不要。"
                },
                support: {
                    title: "サポート付き",
                    desc: "スムーズなセットアップと運用を確保するために、トライアル期間中に技術サポートを提供。"
                }
            }
        },
        contact: {
            title: "お問い合わせ",
            text: "SDIWareに興味がありますか？ライセンス、サポート、その他の情報については、お問い合わせください。"
        },
        impressum: {
            title: "会社情報",
            company: "会社情報",
            legal_form: "有限責任会社",
            managing_director: "代表取締役",
            registered_office: "登記事務所",
            contact_heading: "お問い合わせ",
            email_label: "メール",
            web_label: "ウェブサイト",
            legal: "法的情報",
            vat: "VAT番号 / P.IVA",
            rea: "REA番号",
            share_capital: "資本金",
            paid_in: "全額払込済み",
            single_shareholder: "単独株主会社",
            yes_no: "[はい/いいえ]",
            no: "いいえ",
            disclaimer: "免責事項",
            disclaimer_text: "このウェブサイトのコンテンツは、最大限の注意を払って作成されています。ただし、コンテンツの正確性、完全性、最新性を保証することはできません。"
        }
    },
    ar: {
        nav: {
            home: "الرئيسية",
            features: "الميزات",
            contact: "اتصل بنا",
            useCases: "حالات الاستخدام",
            partners: "الشركاء",
            download: "تحميل",
            impressum: "معلومات الشركة"
        },
        hero: {
            titlePrefix: "تحويل احترافي",
            titleSuffix: "",
            subtitle: "حل برمجي متقدم للتحويل السلس بين تنسيقات SDI و NDI",
            feature1: "زمن انتقال أدنى",
            feature2: "HDR 10-بت",
            feature3: "قناة ألفا",
            feature4: "صوت متعدد",
            feature5: "اتصال داخلي",
            cta1: "تحميل",
            cta2: "معرفة المزيد"
        },
        formats: {
            sdi: "SDI",
            ndi: "NDI",
            ip2110: "IP 2110",
            webrtc: "WebRTC",
            srt: "SRT",
            cef: "CEF"
        },
        features: {
            title: "الميزات الرئيسية",
            latency: {
                title: "زمن انتقال منخفض للغاية",
                desc: "تحويل في الوقت الفعلي مع تأخير ضئيل، مثالي لبيئات الإنتاج المباشر"
            },
            alpha: {
                title: "دعم قناة ألفا",
                desc: "دعم كامل للشفافية لسير عمل الرسومات الاحترافية والطبقات"
            },
            hdr: {
                title: "HDR 10-بت",
                desc: "نطاق ديناميكي عالي مع عمق لون 10 بت لجودة صورة فائقة"
            },
            audio: {
                title: "صوت متعدد القنوات",
                desc: "دعم صوتي شامل لسيناريوهات البث المعقدة"
            },
            tally: {
                title: "تكامل Tally",
                desc: "ميزات tally مدمجة لتكامل سلس لسير عمل الإنتاج"
            },
            preview: {
                title: "البرنامج والمعاينة",
                desc: "معالجة إشارة مزدوجة لتغذيات البرنامج والمعاينة"
            },
            cef_webrtc: {
                title: "CEF & WebRTC",
                desc: "فك تشفير أي عارض HTML من Chromium Embedded Framework أو موقع ويب إلى إشارة بث مباشر (تعبئة ومفتاح). إرسال إدخال الفيديو إلى عارض HTML عبر WebRTC"
            }
        },
        useCases: {
            title: "حالات الاستخدام",
            subtitle: "يتكيف SDIWare مع بيئة الإنتاج الخاصة بك",
            studio: {
                title: "إنتاج الاستوديو المباشر",
                desc1: "يحول SDI-Ware محركات الرسومات المستندة إلى الويب مثل SPX إلى أنظمة جاهزة للبث. قم بتحويل رسومات HTML5 إلى إخراج SDI/NDI/2110 مع ميزات احترافية بما في ذلك دعم tally والاتصال الداخلي وتغذية الفيديو العائدة—كل ذلك من خلال واجهة ويب بديهية. دعم كامل لـ 4K HDR لمعايير الإنتاج من الجيل التالي.",
                desc2: "نشر محركات الرسومات HTML5 مباشرة في بيئات الاستوديو متعددة الكاميرات مع تكامل بث كامل. يوفر SDI-Ware إشارة tally على الشاشة والتحكم في ضوء tally الخارجي وتغذية الفيديو العائدة (RET) حتى يتمكن مشغلو الكاميرا من رؤية إخراج البرنامج في معينات المنظر الخاصة بهم.",
                desc3: "دمج إشارات تعبئة ومفتاح SDI في تدفق NDI واحد مع دعم قناة ألفا. الإخراج عبر SDI التقليدي أو NDI أو SMPTE ST 2110 للمنشآت القائمة على IP. يضمن دعم سير العمل الأصلي 4K HDR أن تتطابق رسوماتك مع جودة أنظمة الكاميرات الحديثة."
            },
            broadcast: {
                title: "إنتاج البث الخارجي",
                desc1: "استبدل أرفف المعدات المتخصصة بحلول مدمجة قائمة على البرمجيات. قم بتركيب كمبيوتر أحادي اللوحة خلف معين منظر الكاميرا للحصول على نظام كامل للرسومات والتشفير على الكاميرا—تمامًا كما تم إثباته خلال 174 ساعة من الإنتاج المباشر في بطولة ISU الكبرى للتزحلق على الجليد.",
                desc2: "تصميم مستقل عن الأجهزة يدعم بطاقات الالتقاط BMD Decklink و Magewell وغيرها. اتصال داخلي مدمج مع الضغط للتحدث، وإشارة tally خارجية عبر واجهة Arduino، وتكوين الشبكة من خلال واجهة الويب تعني إعدادًا أسرع وكابلات أقل في الميدان. إخراج 4K HDR لإنتاجات مستقبلية."
            },
            corporate: {
                title: "فعاليات الشركات المباشرة",
                desc1: "اجلب إنتاج بجودة البث إلى اتصالات المؤسسة دون الحاجة إلى خبرة البث. تكتسب اجتماعات البلدية وإطلاق المنتجات وعروض المستثمرين وجلسات التدريب لمسة احترافية من خلال رسومات HTML5 التي يمكن لمطوري الويب إنشاؤها وتعديلها في الوقت الفعلي. لا حاجة لمشغلي رسومات متخصصين—تحكم في كل شيء من خلال واجهات ويب مألوفة.",
                desc2: "مدعوم من قادة الصناعة: تم دمج SDI-Ware في حلول الأجهزة <a href=\"https://mmgaxis.io\" target=\"_blank\" rel=\"noopener noreferrer\">mmagaxis.io</a>، الموثوق بها من قبل المؤسسات في جميع أنحاء العالم لإنتاج فعاليات الشركات. تجمع هذه الشراكة بين منصات فعاليات الشركات المخصصة من mmagaxis.io وتحويل الرسومات إلى البث المرن من SDI-Ware، وتقديم حلول جاهزة لفرق الاتصالات المهنية.",
                desc3: "يضمن ترميز SpeedHQ زمن انتقال منخفض للتفاعل المباشر، بينما يتكامل إخراج NDI أو ST 2110 بسلاسة مع خلاطات الإنتاج الحديثة ومنصات البث المباشر. يوفر الدعم الكامل لـ 4K HDR جودة مرئية متميزة للعروض التقديمية على المستوى التنفيذي. انشر على أجهزة mmagaxis.io للحصول على أنظمة معتمدة وجاهزة للإنتاج، أو ادمج SDI-Ware في البنية التحتية الحالية الخاصة بك."
            },
            remote: {
                title: "الإنتاج عن بُعد والسحابي",
                desc1: "تمكين سير العمل الموزع حيث توجد الرسومات والكاميرات وغرف التحكم في مواقع مختلفة. قم بتشغيل SDI-Ware على خوادم سحابية أو محطات عمل بعيدة، مع نقل NDI أو SMPTE ST 2110 الذي يلغي الحاجة إلى بنية تحتية مخصصة للفيديو.",
                desc2: "قم بتكوين جميع الإعدادات—تدفقات NDI وتدفقات 2110 ومعلمات الشبكة وتوجيه الصوت وموضع PiP—من خلال واجهة الويب دون لمس الأجهزة. متوافق مع NDI Bridge لتشغيل مثيلات متعددة على نفس الجهاز.",
                desc3: "مثالي لاستوديوهات المنزل والإنتاجات متعددة المواقع أو سير العمل المختلط الذي يجمع بين الموارد المحلية والسحابية. قم بالتوسع من HD إلى 4K HDR مع تطور النطاق الترددي والمتطلبات."
            }
        },
        partners: {
            title: "شركاء التكنولوجيا",
            subtitle: "تكاملات موثوقة مع منصات رائدة في الصناعة"
        },
        download: {
            title: "تحميل SDIWare",
            subtitle: "اطلب النسخة التجريبية لمدة 30 يومًا (رابط التحميل صالح لمدة 48 ساعة)",
            pdfTitle: "معلومات المنتج",
            pdfDesc: "قم بتنزيل العرض التفصيلي الخاص بنا لمعرفة المزيد عن ميزات ومواصفات SDIWare",
            pdfButton: "تحميل PDF",
            form: {
                name: "الاسم الكامل",
                email: "عنوان البريد الإلكتروني",
                company: "اسم الشركة",
                role: "دورك",
                useCase: "حالة الاستخدام المقصودة",
                selectOption: "-- اختر خيارًا --",
                liveStudio: "إنتاج الاستوديو المباشر",
                obVan: "البث الخارجي / سيارة البث المتنقلة",
                corporateEvents: "فعاليات الشركات",
                remoteProduction: "الإنتاج عن بُعد/السحابي",
                other: "أخرى",
                gdprConsent: "أوافق على معالجة بياناتي الشخصية وأقبل سياسة الخصوصية",
                newsletter: "أرغب في تلقي التحديثات حول SDIWare (اختياري)",
                submit: "طلب رابط التحميل"
            },
            info: {
                trial: {
                    title: "نسخة تجريبية لمدة 30 يومًا",
                    desc: "نسخة تجريبية كاملة الميزات بدون قيود. مثالية للاختبار في بيئة الإنتاج الخاصة بك."
                },
                instant: {
                    title: "وصول فوري",
                    desc: "احصل على رابط التحميل عبر البريد الإلكتروني في غضون دقائق. لا حاجة لبطاقة ائتمان."
                },
                support: {
                    title: "الدعم متضمن",
                    desc: "احصل على الدعم الفني خلال فترة التجربة لضمان إعداد وتشغيل سلس."
                }
            }
        },
        contact: {
            title: "تواصل معنا",
            text: "مهتم بـ SDIWare؟ اتصل بنا للحصول على الترخيص أو الدعم أو مزيد من المعلومات."
        },
        impressum: {
            title: "معلومات الشركة",
            company: "معلومات الشركة",
            legal_form: "شركة ذات مسؤولية محدودة",
            managing_director: "المدير العام",
            registered_office: "المكتب المسجل",
            contact_heading: "اتصل بنا",
            email_label: "البريد الإلكتروني",
            web_label: "الموقع الإلكتروني",
            legal: "المعلومات القانونية",
            vat: "رقم ضريبة القيمة المضافة / P.IVA",
            rea: "رقم REA",
            share_capital: "رأس المال",
            paid_in: "مدفوع بالكامل",
            single_shareholder: "شركة مساهم واحد",
            yes_no: "[نعم/لا]",
            no: "لا",
            disclaimer: "إخلاء المسؤولية",
            disclaimer_text: "تم إنشاء محتوى هذا الموقع بأقصى قدر من العناية. ومع ذلك، لا يمكننا ضمان دقة واكتمال وحداثة المحتوى."
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}