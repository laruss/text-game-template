# Passage

Нужно сформулировать, что такое `passage`.

Итак, у меня есть `place` и `story`, которые могут меняться на экране.
`passage` могут быть как `place`, так и `story`.
Наверное, `passage` - это вообще любой экран, который может быть показан игроку, будь то `place`, `story` или кастомный экран.

Для поддержки этой логики нужно будет регестрировать `passage` и дать следующие возможности:
- игра должна иметь возможность `jumpTo` passage.
- игра должна иметь возможность продолжить один `passage` другим без смены экрана. (напр, навзать это `show` passage)
- нужно сохранять текущий `passage`, чтобы при перезагрузке страницы можно было восстановить состояние игры.

Что нужно сделать:
- создать класс `Passage`.
- в `Game` добавить регистрацию `Passage` (как статический метод. Например, `Game.registerPassage(passage: Passage)`).
- добавить в `Game` метод `jumpTo(passage: Passage)`, который будет переключать экран на указанный `passage`.
- добавить в `Game` метод `getCurrentPassage()`, который будет возвращать текущий `passage`.
- добавить в `Game` метод `getPassageById(id: string)`, который будет возвращать `passage` по его идентификатору.
- добавить в `Game` метод `getPassages()`, который будет возвращать все зарегистрированные `passage`.
- создать класс `StoryComponent`, который должен представлять собой текстовую историю.
- возможно, нужно будет создать метод-фабрику `newStory`, который будет создавать экземпляр `StoryComponent` и будет сделан так же, как https://pixi-vn.web.app/start/dialogue
- создать класс `Place`, который должен представлять собой игровое место. Подумать о воплощении.
- возможно, нужно будет создать метод-фабрику `newPlace`, который будет создавать экземпляр `Place`
- всё это нужно будет интегрировать в `Game` и текущую логику.

---

# Game storage

It should be possible to get game state any time by calling `Game.getState()`. This method should return a serialized state of the game.
Also the game object should have a method `Game.loadState(state)` that will load the state from the serialized object.
After loading the state, the game should restore the current passage and all the saved variables.
