@@ .. @@
 <template>
   <div :class="$style.battleArena">
-    <div :class="$style.fightersContainer">
-      <FighterCard
-        :class="[$style.monsterCard, { [$style.isHit]: isMonsterHit, [$style.isActive]: isMonsterTurn, [$style.isCritical]: isMonsterCritical }]"
-        :name="currentMonster?.name[lang] || 'Monster'"
-        :health="monsterHealth"
-        :maxHealth="getMonsterMaxHealth(currentLevel)"
-        :stamina="monsterStamina"
-        :maxStamina="maxStamina"
-        :avatar="monsterImg"
-        :is-player="false"
-      />
-      
-      <FighterCard
-        :class="[$style.playerCard, { [$style.isHit]: isPlayerHit, [$style.isDefending]: isPlayerDefending, [$style.isHealing]: isHealing, [$style.isActive]: !isMonsterTurn, [$style.isCritical]: isPlayerCritical }]"
-        :name="selectedCharacter?.name[lang] || 'Player'"
-        :health="playerHealth"
-        :maxHealth="getPlayerMaxHealth(currentLevel)"
-        :stamina="playerStamina"
-        :maxStamina="maxStamina"
-        :avatar="playerImg"
-        :is-player="true"
-      />
+    <!-- Compact Battle Layout -->
+    <div :class="$style.battleLayout">
+      <!-- Monster Section -->
+      <div :class="[$style.fighterSection, $style.monsterSection, { [$style.isHit]: isMonsterHit, [$style.isActive]: isMonsterTurn, [$style.isCritical]: isMonsterCritical }]">
+        <div :class="$style.fighterInfo">
+          <h3 :class="$style.fighterName">{{ currentMonster?.name[lang] || 'Monster' }}</h3>
+          <div :class="$style.healthInfo">
+            <span :class="$style.healthLabel">{{ t('monsterHealth') }}</span>
+            <BaseProgressBar
+              :value="monsterHealth"
+              :max="getMonsterMaxHealth(currentLevel)"
+              :class="$style.healthBar"
+              type="health"
+            />
+          </div>
+          <div :class="$style.staminaInfo">
+            <span :class="$style.staminaLabel">{{ lang === 'es' ? 'CARGA' : 'CHARGE' }}</span>
+            <BaseProgressBar
+              :value="monsterStamina"
+              :max="maxStamina"
+              :class="$style.staminaBar"
+              type="stamina"
+            />
+          </div>
+        </div>
+        <div :class="$style.fighterAvatar">
+          <BaseAvatar
+            :src="monsterImg"
+            :alt="currentMonster?.name[lang] || 'Monster'"
+            :size="120"
+            :class="$style.monsterAvatar"
+          />
+          <div v-if="slashMonster" :class="$style.slashEffect"></div>
+          <div v-if="burstMonsterSpecial" :class="$style.burstEffect"></div>
+        </div>
+      </div>
+
+      <!-- VS Indicator -->
+      <div :class="$style.vsIndicator">
+        <span :class="$style.vsText">VS</span>
+        <div :class="$style.turnIndicator">
+          {{ isMonsterTurn ? t('turnMonster') : t('turnPlayer') }}
+        </div>
+      </div>
+
+      <!-- Player Section -->
+      <div :class="[$style.fighterSection, $style.playerSection, { [$style.isHit]: isPlayerHit, [$style.isDefending]: isPlayerDefending, [$style.isHealing]: isHealing, [$style.isActive]: !isMonsterTurn, [$style.isCritical]: isPlayerCritical }]">
+        <div :class="$style.fighterAvatar">
+          <BaseAvatar
+            :src="playerImg"
+            :alt="selectedCharacter?.name[lang] || 'Player'"
+            :size="120"
+            :class="$style.playerAvatar"
+          />
+          <div v-if="slashPlayer" :class="$style.slashEffect"></div>
+          <div v-if="isHealing" :class="$style.healEffect"></div>
+        </div>
+        <div :class="$style.fighterInfo">
+          <h3 :class="$style.fighterName">{{ selectedCharacter?.name[lang] || 'Player' }}</h3>
+          <div :class="$style.healthInfo">
+            <span :class="$style.healthLabel">{{ t('yourHealth') }}</span>
+            <BaseProgressBar
+              :value="playerHealth"
+              :max="getPlayerMaxHealth(currentLevel)"
+              :class="$style.healthBar"
+              type="health"
+            />
+          </div>
+          <div :class="[$style.staminaInfo, { [$style.staminaFull]: canUseSuperSpecial }]">
+            <span :class="$style.staminaLabel">{{ canUseSuperSpecial ? (lang === 'es' ? 'SUPER!' : 'SUPER!') : (lang === 'es' ? 'CARGA' : 'CHARGE') }}</span>
+            <BaseProgressBar
+              :value="playerStamina"
+              :max="maxStamina"
+              :class="$style.staminaBar"
+              type="stamina"
+            />
+          </div>
+        </div>
+      </div>
     </div>
   </div>
 </template>