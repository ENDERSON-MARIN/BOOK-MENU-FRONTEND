/**
 * Mensagens padronizadas para toast notifications
 */

export const toastMessages = {
  // User messages
  user: {
    createSuccess: "Usuário criado com sucesso",
    createError: "Erro ao criar usuário",
    updateSuccess: "Usuário atualizado com sucesso",
    updateError: "Erro ao atualizar usuário",
    toggleStatusSuccess: "Status do usuário alterado com sucesso",
    toggleStatusError: "Erro ao alterar status do usuário",
  },

  // Category messages
  category: {
    createSuccess: "Categoria criada com sucesso",
    createError: "Erro ao criar categoria",
    updateSuccess: "Categoria atualizada com sucesso",
    updateError: "Erro ao atualizar categoria",
    deleteSuccess: "Categoria excluída com sucesso",
    deleteError: "Erro ao excluir categoria",
    toggleStatusSuccess: "Status da categoria alterado com sucesso",
    toggleStatusError: "Erro ao alterar status da categoria",
  },

  // Menu Item messages
  menuItem: {
    createSuccess: "Item de menu criado com sucesso",
    createError: "Erro ao criar item de menu",
    updateSuccess: "Item de menu atualizado com sucesso",
    updateError: "Erro ao atualizar item de menu",
    deleteSuccess: "Item de menu excluído com sucesso",
    deleteError: "Erro ao excluir item de menu",
  },

  // Menu messages
  menu: {
    createSuccess: "Cardápio criado com sucesso",
    createError: "Erro ao criar cardápio",
    updateSuccess: "Cardápio atualizado com sucesso",
    updateError: "Erro ao atualizar cardápio",
    deleteSuccess: "Cardápio excluído com sucesso",
    deleteError: "Erro ao excluir cardápio",
  },

  // Reservation messages
  reservation: {
    createSuccess: "Reserva criada com sucesso",
    createError: "Erro ao criar reserva",
    updateSuccess: "Variação alterada com sucesso",
    updateError: "Erro ao alterar variação",
    cancelSuccess: "Reserva cancelada com sucesso",
    cancelError: "Erro ao cancelar reserva",
  },

  // Auth messages
  auth: {
    loginSuccess: "Login realizado com sucesso",
    loginError: "Erro ao fazer login",
    logoutSuccess: "Logout realizado com sucesso",
    sessionExpired: "Sessão expirada. Faça login novamente",
    unauthorized: "Você não tem permissão para acessar este recurso",
  },

  // Generic messages
  generic: {
    success: "Operação realizada com sucesso",
    error: "Erro ao realizar operação",
    validationError: "Erro de validação. Verifique os campos",
    networkError: "Erro de conexão. Verifique sua internet",
  },
} as const;
