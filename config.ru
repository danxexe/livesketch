require 'bundler'
Bundler.require

Opal.append_path 'app'

opal = Opal::Server.new {|s|
  s.append_path 'app'
  s.append_path 'assets'
  s.main = 'application'
}

map '/assets' do
  run opal.sprockets
end

get '/' do
  send_file 'index.html'
end

run Sinatra::Application