CaixaSeguros::Application.routes.draw do

	match '/introducao' => 'home#introducao'
  root :to => 'home#index'
end
