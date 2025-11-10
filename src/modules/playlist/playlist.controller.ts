import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @MessagePattern('createPlaylist')
  create(@Payload() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @MessagePattern('findAllPlaylist')
  findAll() {
    return this.playlistService.findAll();
  }

  @MessagePattern('findOnePlaylist')
  findOne(@Payload() id: number) {
    return this.playlistService.findOne(id);
  }

  @MessagePattern('updatePlaylist')
  update(@Payload() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistService.update(updatePlaylistDto.id, updatePlaylistDto);
  }

  @MessagePattern('removePlaylist')
  remove(@Payload() id: number) {
    return this.playlistService.remove(id);
  }
}
