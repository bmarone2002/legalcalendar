# Errore "Unknown argument macroType" – come risolvere

Il client Prisma non è aggiornato con i campi `macroType`, `actionType`, `actionMode`, `inputs`.

## Passi

1. **Ferma il server di sviluppo**  
   Nella finestra dove gira `npm run dev` premi **Ctrl+C** e attendi che si chiuda.

2. **Rigenera il client Prisma**  
   Nella cartella del progetto (`legal-calendar`) esegui:
   ```bash
   npx prisma generate
   ```
   Se compare ancora un errore tipo `EPERM` o `operation not permitted`, chiudi Cursor/VS Code, riapri il progetto ed esegui di nuovo `npx prisma generate` da terminale.

3. **Riavvia il server**  
   ```bash
   npm run dev
   ```

Dopo questi passaggi il salvataggio dell’evento “Atto Giuridico” dovrebbe funzionare.
