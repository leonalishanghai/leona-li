import { HeroFilm } from './hero-film.js';
import { BrandIdentity } from './brand-identity.js';
import { mountNavigation } from './navigation.js';
import { mountReveal } from './reveal.js';

mountNavigation();
mountReveal();
new HeroFilm(document.querySelector('[data-hero]')).mount();
new BrandIdentity(document.querySelector('[data-brand-identity]')).mount();
