describe('Módulo de Edición de Pacientes - VacunApp MX', () => {
  it('Debe actualizar exitosamente el nombre de un paciente existente', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    
    cy.get('a[href="/patients"]').click();

    // Clic en el icono de editar (lápiz) del primer paciente
    cy.get('tbody tr').first().find('button, a').eq(-2).click(); // Asumiendo que editar es el penúltimo icono

    // Modificar el nombre
    const nuevoNombre = `Paciente Editado ${Date.now()}`;
    cy.get('input[name="full_name"]').clear().type(nuevoNombre);

    // Guardar cambios
    cy.contains('Guardar Cambios').click();

    // Verificar que el nombre actualizado aparece en la tabla
    cy.contains(nuevoNombre).should('be.visible');
  });
});