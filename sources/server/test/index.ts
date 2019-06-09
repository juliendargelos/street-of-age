import { when, autorun } from 'mobx'
import { Room } from '../src/entities/Room'
import { Game } from '../src/entities/Game'
import { Player } from '../src/entities/Player'
import { Character, CharacterKind } from '../src/entities/Character'
import { TeamKind } from '../src/entities/Team'

const player0 = new Player('player-0')

const room = new Room(player0, 4)

when(() => room.ready, () => {
  const game = new Game(room.players)

  autorun(() => {
    console.log(
      game.turn.toString().padStart(2),
      game.currentTeam.kind.padStart(5),
      game.currentPlayer.id,
      game.currentCharacter.id
    )
  })

  setInterval(() => {
    game.nextTurn()
  }, 200)
})

const player1 = new Player('player-1')
const player2 = new Player('player-2')
const player3 = new Player('player-3')

room.players.add(player1)
room.players.add(player2)
room.players.add(player3)

player0.teamKind = TeamKind.Young
player0.characters.set([
  new Character(CharacterKind.Egocentric),
  new Character(CharacterKind.Geek),
  new Character(CharacterKind.Hippie)
])

player1.teamKind = TeamKind.Young
player1.characters.set([
  new Character(CharacterKind.Egocentric),
  new Character(CharacterKind.Geek),
  new Character(CharacterKind.Hippie)
])

player2.teamKind = TeamKind.Old
player2.characters.set([
  new Character(CharacterKind.DotingGranny),
  new Character(CharacterKind.FustyGrandpa),
  new Character(CharacterKind.LapdogWoman)
])

player3.teamKind = TeamKind.Old
player3.characters.set([
  new Character(CharacterKind.DotingGranny),
  new Character(CharacterKind.FustyGrandpa),
  new Character(CharacterKind.LapdogWoman)
])
