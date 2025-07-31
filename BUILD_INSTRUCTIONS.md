# Configuración para builds automáticos

## GitHub Actions
El workflow en `.github/workflows/eas-build.yml` se ejecutará automáticamente en cada push a main.

## Configuración manual
Para hacer un build del último commit manualmente:

1. Asegúrate de estar en el último commit:
   ```bash
   git pull origin main
   ```

2. Ejecuta el build:
   ```bash
   eas build --platform android --profile preview
   ```

## Build con commit específico
Para hacer build de un commit específico:
```bash
git checkout <commit-hash>
eas build --platform android --profile preview
```

## Configuración de EAS para usar siempre el último commit
- El archivo `eas.json` ahora incluye `autoIncrement: true`
- Esto incrementará automáticamente el versionCode en cada build
