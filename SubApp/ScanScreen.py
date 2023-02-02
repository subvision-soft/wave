import cv2
from kivy.app import App
from kivy.clock import Clock
from kivy.graphics.texture import Texture
from kivy.lang import Builder
from kivy.uix.boxlayout import BoxLayout
import time
Builder.load_string('''
<ScanScreen>:
    orientation: 'vertical'
    Image:
        id: camera
        
    ToggleButton:
        text: 'Play'
        on_press: camera.play = not camera.play
        size_hint_y: None
        height: '48dp'
    Button:
        text: 'Capture'
        size_hint_y: None
        height: '48dp'
        on_press: root.capture()
''')


class ScanScreen(BoxLayout):

    def __init__(self, capture, fps, **kwargs):
        super(ScanScreen, self).__init__(**kwargs)
        self.capture = capture
        Clock.schedule_interval(self.update, 1.0 / fps)

    def build(self):
        self.capture = cv2.VideoCapture(1)
        self.my_camera = ScanScreen(capture=self.capture, fps=30)
        return self.my_camera

    def on_stop(self):
        # without this, app will not exit even if the window is closed
        self.capture.release()

    def update(self, dt):
        ret, frame = self.capture.read()
        if ret:
            # convert it to texture
            buf1 = cv2.flip(frame, 0)
            buf = buf1.tostring()
            image_texture = Texture.create(
                size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
            image_texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
            # display image from the texture
            self.texture = image_texture


    def capture(self):
        '''
        Function to capture the images and give them the names
        according to their captured time and date.
        '''
        camera = self.ids['camera']
        timestr = time.strftime("%Y%m%d_%H%M%S")
        camera.export_to_png("IMG_{}.png".format(timestr))
        print("Captured")

    def on_texture(self):
        camera = self.ids['camera']
        image = camera.texture
        print(image)

        # from kivy.app import App
        # from kivy.uix.image import Image
        # from kivy.clock import Clock
        # from kivy.graphics.texture import Texture
        # import cv2
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
        # class CamApp(App):
        #     def build(self):
        #         self.capture = cv2.VideoCapture(1)
        #         self.my_camera = KivyCamera(capture=self.capture, fps=30)
        #         return self.my_camera
        #
        #     def on_stop(self):
        #         # without this, app will not exit even if the window is closed
        #         self.capture.release()
        #
        # if __name__ == '__main__':
        #     CamApp().run()