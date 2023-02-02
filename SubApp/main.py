from kivymd.app import MDApp
from kivy.lang import Builder
from kivy.core.window import Window



Window.size = (300, 500)




class App(MDApp):
    def build(self):
        self.icon = "logo.png"
        self.title = "SubApp"
        screen = Builder.load_file("NavigationDrawer.kv")
        return screen

    def on_start(self):
        pass


App().run()



#
# ScreenManager:
#     MenuScreen:
#     ProfileScreen:
#     UploadScreen:
#
# <MenuScreen>:
#     name: 'menu'
#     MDRectangleFlatButton:
#         text: 'Profile'
#         pos_hint: {'center_x':0.5,'center_y':0.6}
#         on_press: root.manager.current = 'profile'
#     MDRectangleFlatButton:
#         text: 'Upload'
#         pos_hint: {'center_x':0.5,'center_y':0.5}
#         on_press: root.manager.current = 'upload'
#
# <ProfileScreen>:
#     name: 'profile'
#     MDLabel:
#         text: 'Profile'
#         halign: 'center'
#     MDRectangleFlatButton:
#         text: 'Back'
#         pos_hint: {'center_x':0.5,'center_y':0.1}
#         on_press: root.manager.current = 'menu'
#
# <UploadScreen>:
#     name: 'upload'
#     MDLabel:
#         text: 'Upload'
#         halign: 'center'
#     MDRectangleFlatButton:
#         text: 'Back'
#         pos_hint: {'center_x':0.5,'center_y':0.1}
#         on_press: root.manager.current = 'menu'
#
# """




# from kivy.app import App
# from kivy.uix.image import Image
# from kivy.clock import Clock
# from kivy.graphics.texture import Texture
# import cv2
#
#
# class KivyCamera(Image):
#     def __init__(self, capture, fps, **kwargs):
#         super(KivyCamera, self).__init__(**kwargs)
#         self.capture = capture
#         Clock.schedule_interval(self.update, 1.0 / fps)
#
#     def update(self, dt):
#         ret, frame = self.capture.read()
#         if ret:
#             # convert it to texture
#             buf1 = cv2.flip(frame, 0)
#             buf = buf1.tostring()
#             image_texture = Texture.create(
#                 size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
#             image_texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
#             # display image from the texture
#             self.texture = image_texture
#
#
# class CamApp(App):
#     def build(self):
#         self.capture = cv2.VideoCapture(1)
#         self.my_camera = KivyCamera(capture=self.capture, fps=30)
#         return self.my_camera
#
#     def on_stop(self):
#         #without this, app will not exit even if the window is closed
#         self.capture.release()
#
#
# if __name__ == '__main__':
#     CamApp().run()