@@ .. @@
        <div class="header-actions">
         <!-- Desktop Settings Button (smaller) -->
         <button class="desktop-settings-toggle" @click="toggleMobileSettings" aria-label="Settings">
           ⚙️
         </button>
       </div>

       <!-- Settings Dropdown Overlay -->
       <div class="mobile-settings-overlay" :class="{ open: showMobileSettings }" @click="showMobileSettings = false"></div>
       <div class="settings-dropdown-container">
         <button class="settings-toggle" @click="toggleMobileSettings" aria-label="Settings">⚙️</button>
         <div class="settings-dropdown" :class="{ open: showMobileSettings }">
           <div class="lang-group">
             <div class="setting-label">{{ lang === 'es' ? 'IDIOMA' : 'LANGUAGE' }}</div>
             <button class="lang-btn" :class="{ active: lang==='es' }" @click="setLang('es')">ES</button>
             <button class="lang-btn" :class="{ active: lang==='en' }" @click="setLang('en')">EN</button>
           </div>
           
           <button v-if="playerName && started" class="settings-menu-item" @click="openUserMenu">
             <span class="menu-icon">👤</span>
             <span class="menu-text">{{ lang === 'es' ? 'PERFIL' : 'PROFILE' }}</span>
           </button>
           
           <button class="settings-menu-item" @click="toggleSound">
             <span class="menu-icon">{{ soundEnabled ? '🔊' : '🔇' }}</span>
             <span class="menu-text">{{ lang === 'es' ? 'SONIDO' : 'SOUND' }}</span>
           </button>
           
           <button class="settings-menu-item" @click="toggleTheme">
             <span class="menu-icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
             <span class="menu-text">{{ lang === 'es' ? 'TEMA' : 'THEME' }}</span>
           </button>
           
           <button class="settings-menu-item" @click="openHelp">
             <span class="menu-icon">ℹ️</span>
             <span class="menu-text">{{ lang === 'es' ? 'AYUDA' : 'HELP' }}</span>
           </button>
         </div>
       </div>
     </header>
         <div class="lang-group">
           <div class="setting-label">{{ lang === 'es' ? 'IDIOMA' : 'LANGUAGE' }}</div>
           <button class="lang-btn" :class="{ active: lang==='es' }" @click="setLang('es')">ES</button>
           <button class="lang-btn" :class="{ active: lang==='en' }" @click="setLang('en')">EN</button>
         </div>
         
         <button v-if="playerName && started" class="settings-menu-item" @click="openUserMenu">
           <span class="menu-icon">👤</span>
           <span class="menu-text">{{ lang === 'es' ? 'PERFIL' : 'PROFILE' }}</span>
         </button>
         
         <button class="settings-menu-item" @click="toggleSound">
           <span class="menu-icon">{{ soundEnabled ? '🔊' : '🔇' }}</span>
           <span class="menu-text">{{ lang === 'es' ? 'SONIDO' : 'SOUND' }}</span>
         </button>
         
         <button class="settings-menu-item" @click="toggleTheme">
           <span class="menu-icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
           <span class="menu-text">{{ lang === 'es' ? 'TEMA' : 'THEME' }}</span>
         </button>
         
         <button class="settings-menu-item" @click="openHelp">
           <span class="menu-icon">ℹ️</span>
           <span class="menu-text">{{ lang === 'es' ? 'AYUDA' : 'HELP' }}</span>
         </button>
       </div>
     </header>