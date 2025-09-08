## 타임투게더 NextJS

### 프론트 개발자 주의 사항 
- svgr 설치하여 사용 중
- `src/assets/svgs` 폴더 내부의 svg 이미지들은 `svgr` 처리되어 반드시 컴포넌트처럼 사용해야 한다.
- 그 외, 폴더의 svg들은 URL 기반으로 처리하여, `<Image>` 태그에 사용가능.
- 해당 설정은 `src/svgr.d.ts`, `next.config.ts` 참고.
- svg이미지 크기 변경 필요시, 텍스트 편집으로 width, height 속성 제거할 것. 경우가 잦을 경우 일괄 처리 예정

### 폴 더 구조 9월 8일 기준
```
SRC
├─app
│  │  favicon.ico
│  │  fonts.ts
│  │  globals.css
│  │  layout.tsx
│  │  loading.tsx
│  │  page.tsx
│  │  
│  ├─(auth)
│  │  ├─login
│  │  │      layout.tsx
│  │  │      page.tsx
│  │  │      
│  │  └─register
│  │          layout.tsx
│  │          page.tsx
│  │          
│  ├─(dashboard)
│  │  ├─calendar
│  │  │      layout.tsx
│  │  │      page.tsx
│  │  │      
│  │  ├─groups
│  │  │  │  EnterGroupDialog.tsx
│  │  │  │  ExitGroupDialog.tsx
│  │  │  │  GroupItem.tsx
│  │  │  │  layout.tsx
│  │  │  │  page.tsx
│  │  │  │  
│  │  │  ├─create
│  │  │  │      page.tsx
│  │  │  │      
│  │  │  └─detail
│  │  │          GroupInviteDialog.tsx
│  │  │          GroupMemberItem.tsx
│  │  │          GroupScheduleItem.tsx
│  │  │          page.tsx
│  │  │          
│  │  ├─my
│  │  │      layout.tsx
│  │  │      page.tsx
│  │  │      
│  │  └─schedules
│  │      │  constants.ts
│  │      │  layout.tsx
│  │      │  page.tsx
│  │      │  
│  │      ├─add-place-ai
│  │      │  │  layout.tsx
│  │      │  │  page.tsx
│  │      │  │  
│  │      │  └─components
│  │      │          RecommandItem.tsx
│  │      │          SearchBar.tsx
│  │      │          
│  │      ├─add-place-direct
│  │      │      layout.tsx
│  │      │      page.tsx
│  │      │      
│  │      ├─components
│  │      │      ScheduleDialog.tsx
│  │      │      ScheduleItem.tsx
│  │      │      TeamItem.tsx
│  │      │      
│  │      ├─create
│  │      │      page.tsx
│  │      │      
│  │      └─detail
│  │          │  page.tsx
│  │          │  When2Meet.tsx
│  │          │  Where2Meet.tsx
│  │          │  
│  │          ├─components
│  │          │      ParticipantCard.tsx
│  │          │      PlaceCardItem.tsx
│  │          │      ScheduleDrawer.tsx
│  │          │      WhenConfirmDrawer.tsx
│  │          │      
│  │          ├─when-components
│  │          │      MemberCountPalette.tsx
│  │          │      
│  │          └─where-components
│  │                  AddPlaceDialog.tsx
│  │                  PlaceCard.tsx
│  │                  
│  └─api
│          auth.ts
│          
├─assets
│  ├─pngs
│  │      location.png
│  │      logo-full.png
│  │      logo-full.svg
│  │      logo-white.png
│  │      logo-white.svg
│  │      pencil.png
│  │      
│  └─svgs
│      └─icons
│              arrow-down-gray.svg
│              arrow-left-black.svg
│              arrow-left-gray.svg
│              arrow-right-gray.svg
│              arrow-up-gray.svg
│              calender-off.svg
│              calender-on.svg
│              checked.svg
│              default-member-image.svg
│              group-master.svg
│              group-off.svg
│              group-on.svg
│              group-user.svg
│              menu-black.svg
│              mypage-off.svg
│              mypage-on.svg
│              plus-gray.svg
│              plus-white.svg
│              schedule-off.svg
│              schedule-on.svg
│              search.svg
│              trashcan.svg
│              unchecked.svg
│              x-black.svg
│              x-gray.svg
│              x-white.svg
│              
├─components
│  ├─shared
│  │  │  loading.tsx
│  │  │  
│  │  ├─BottomNav
│  │  │      BottomNav.tsx
│  │  │      
│  │  ├─Dialog
│  │  │      PlainDialog.tsx
│  │  │      YesNoDialog.tsx
│  │  │      
│  │  ├─Input
│  │  │      RadioButton.tsx
│  │  │      TextInput.tsx
│  │  │      
│  │  └─ToastButton
│  │          ToastButton.tsx
│  │          
│  └─ui
│      │  col-drawer.tsx
│      │  dialog.tsx
│      │  drawer.tsx
│      │  sonner.tsx
│      │  
│      ├─button
│      │      Button.tsx
│      │      
│      └─header
│              Header.tsx
│              
├─hooks
│      example.ts
│      
├─lib
│      utils.ts
│      
├─schemas
│      loginSchemas.ts
│      scheduleSchemas.ts
│      
└─types
        example.ts
        

```