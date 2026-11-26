import { describe, test, expect } from '@jest/globals';

describe('Testes do ReciclaSpot - Sprint 3', () => {
  test('Validação de e-mail do voluntário', () => {
    const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    expect(validarEmail('cidadao@reciclaspot.com')).toBe(true);
    expect(validarEmail('email-errado')).toBe(false);
  });

  test('Formatação de horário do EcoPonto', () => {
    const formatarHorario = (inicio: string, fim: string) => `Seg a Sáb das ${inicio} às ${fim}`;
    
    expect(formatarHorario('08:00', '18:00')).toBe('Seg a Sáb das 08:00 às 18:00');
  });

  test('Cálculo de distância entre pontos', () => {
    const distancia = Math.abs(-21.8055 - -21.7965) * 111;
    
    expect(distancia).toBeGreaterThan(0);
  });
});
