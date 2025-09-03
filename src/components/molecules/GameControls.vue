@@ .. @@
 <style module>
 .gameControls {
   padding: 1rem;
   display: flex;
   flex-wrap: wrap;
   gap: 1rem;
   justify-content: center;
   align-items: center;
   max-width: 600px;
   margin: 0 auto;
   background: var(--surface-color);
   border-radius: 16px;
   border: 1px solid var(--border-color);
 }
 
 .controlButton {
   min-width: 80px;
   height: 50px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 0.2rem;
   border-radius: 12px;
   border: 2px solid var(--border-color);
   background: var(--button-bg);
   color: var(--text-primary);
   font-size: 0.7rem;
   font-weight: 600;
   text-transform: uppercase;
   letter-spacing: 0.5px;
   cursor: pointer;
   transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
   position: relative;
   overflow: hidden;
 }
 
 .buttonIcon {
   font-size: 1.2rem;
 }
 
 .buttonText {
   font-size: 0.65rem;
   line-height: 1;
 }
 
 .controlButton:hover:not(:disabled) {
   transform: translateY(-2px);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   border-color: var(--accent-color);
 }
 
 .controlButton:active:not(:disabled) {
   transform: translateY(0);
 }
 
 .controlButton:disabled {
   opacity: 0.5;
   cursor: not-allowed;
   transform: none;
 }
 
 .isLocked {
   pointer-events: none;
   opacity: 0.6;
 }
 
 /* Responsive Design */
 @media (max-width: 480px) {
   .gameControls {
     padding: 0.75rem;
     gap: 0.75rem;
   }
   
   .controlButton {
     min-width: 70px;
     height: 45px;
   }
   
   .buttonIcon {
     font-size: 1rem;
   }
   
   .buttonText {
     font-size: 0.6rem;
   }
 }
 </style>